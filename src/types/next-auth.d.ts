import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role } from "@prisma/client"; // Import Role enum from Prisma
import { AdapterUser } from "@auth/core/adapters"; // Import AdapterUser type

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
      id: string;
      universityId?: string | null;
      isPasswordChanged: boolean;
    } & DefaultSession["user"]
  }
  interface User {
    role: Role;
    id: string;
    universityId?: string | null;
    isPasswordChanged: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    id: string;
    universityId?: string | null;
    isPasswordChanged: boolean;
  }
}

// Augment AdapterUser to include custom fields
declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
    universityId?: string | null;
    isPasswordChanged: boolean;
  }
}
