import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    trustHost: true,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role: string }).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as unknown as { role: string }).role = token.role as string;
                (session.user as unknown as { id: string }).id = token.id as string;
            }
            return session;
        },
    },
    providers: [], // Configured dynamically in auth.ts
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
