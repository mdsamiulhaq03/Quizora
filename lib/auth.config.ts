import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const providers: NextAuthConfig["providers"] = [];

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  process.env.GITHUB_CLIENT_ID !== "placeholder"
) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== "placeholder"
) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authConfig: NextAuthConfig = {
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const protectedRoutes = [
        "/dashboard",
        "/library",
        "/review",
        "/quiz-history",
        "/profile",
      ];
      const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
      if (isProtected && !auth?.user) return false;
      return true;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
};
