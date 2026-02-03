import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { routing } from './navigation'; // Config ที่เราสร้างใน Phase 1

// 1. สร้างตัวจัดการภาษา (i18n)
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  // 2. เช็คบัตรผ่าน (Auth): ดูว่าล็อกอินหรือยัง?
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuth = !!token;

  // ดึง URL ปัจจุบันมาวิเคราะห์
  const { pathname } = req.nextUrl;
  
  // ลบภาษาออกจาก URL เพื่อดูว่าเนื้อแท้ User จะไปไหน? 
  // (เช่น /en/dashboard/users -> /dashboard/users)
  const pathWithoutLocale = pathname.replace(/^\/(en|ms)/, '') || '/';

  // 📝 รายชื่อโซนหวงห้าม (คนนอกห้ามเข้า)
  // แค่ใส่ '/dashboard' คำเดียว ก็ครอบคลุมทั้ง Admin, Dean, Data Entry แล้วครับ
  const protectedPaths = [
    '/dashboard',       // รวมทุกหน้าใน Dashboard (Users, Meetings, Approvals ฯลฯ)
    '/change-password'  // หน้าเปลี่ยนรหัสผ่าน
  ];

  // ตรวจสอบว่าทางที่กำลังจะไป เป็นทางหวงห้ามหรือไม่?
  const isProtectedRoute = protectedPaths.some(path => 
    pathWithoutLocale.startsWith(path)
  );

  // 3. Logic การป้องกัน:
  // ถ้าเป็นโซนหวงห้าม (isProtectedRoute) และยังไม่มีบัตรผ่าน (!isAuth)
  if (isProtectedRoute && !isAuth) {
    // ดีดไปหน้า Login (โดยคงภาษาเดิมไว้ หรือใช้ en เป็นค่าเริ่มต้น)
    const locale = pathname.match(/^\/(en|ms)/)?.[0] || '/en';
    return NextResponse.redirect(new URL(`${locale}/login`, req.url));
  }

  // 4. ถ้าผ่านด่าน Auth มาได้ (หรือเป็นหน้าสาธารณะ) -> ให้ระบบภาษาทำงานต่อ
  return intlMiddleware(req);
}

export const config = {
  // Matcher: บังคับให้ Middleware ทำงานกับทุกหน้า 
  // ยกเว้น: API, ไฟล์ระบบ Next.js, และไฟล์รูปภาพ/static ต่างๆ
  matcher: [
    '/', 
    '/(en|ms)/:path*', 
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};