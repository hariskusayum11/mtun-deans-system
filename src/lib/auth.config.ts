import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      
      const isOnDashboard = pathname.startsWith("/dashboard");
      const isOnLoginPage = pathname.startsWith("/login");

      // Rule 1: Dashboard routes require login
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      // Rule 2: Redirect logged-in users away from login page
      if (isOnLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Rule 3: ALL other routes (Root /, Public pages) MUST return true
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
