import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db"; // ✅ เรียกใช้ db ตัวกลาง (Singleton)
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. ทำงานตอน Login ครั้งแรก (รับค่าจาก authorize)
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.universityId = user.universityId;
        token.isPasswordChanged = user.isPasswordChanged;
      }

      // ✅ [ส่วนที่เพิ่มมา] แก้ปัญหา Session ค้าง:
      // ถ้ารหัสยังไม่เปลี่ยน (ตามที่จำไว้ใน Token) ให้ลองเช็ค Database อีกรอบ
      // เผื่อว่า User เพิ่งเปลี่ยนรหัสเสร็จตะกี้
      if (token.sub && !token.isPasswordChanged) {
        try {
          const existingUser = await db.user.findUnique({ 
            where: { id: token.sub },
            select: { isPasswordChanged: true } // ดึงมาแค่ field เดียวพอ
          });
          
          if (existingUser) {
            token.isPasswordChanged = existingUser.isPasswordChanged;
          }
        } catch (error) {
          console.error("Error refreshing user status:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // ส่งค่าจาก Token ไปให้หน้าเว็บใช้งาน (ผ่าน useSession)
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.universityId = token.universityId as string | null;
        session.user.isPasswordChanged = token.isPasswordChanged as boolean;
      }
      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        
        if (!email || !password) return null;

        const user = await db.user.findUnique({ 
          where: { email: email as string } 
        });

        if (!user || !user.password_hash) return null;

        const passwordsMatch = await bcrypt.compare(
          password as string, 
          user.password_hash
        );
        
        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            // Map ชื่อ field ให้ตรงกับ Type ที่เราประกาศ
            universityId: user.university_id, 
            isPasswordChanged: user.isPasswordChanged,
          };
        }
        return null;
      },
    }),
  ],
});