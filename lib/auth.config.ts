import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config for middleware.
 * Do not import Prisma, bcrypt, or other Node-only packages here.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role =
          token.role === "SUPER_ADMIN" || token.role === "ADMIN" ? token.role : "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
