import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                userType: { label: "User Type", type: "text" },
                role: { label: "Role", type: "text" },
            },
            async authorize(credentials) {
                console.log("--- AUTHORIZE START ---");
                console.log("Raw Credentials:", credentials);

                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing email or password");
                    return null;
                }

                const email = (credentials.email as string)?.toLowerCase().trim();
                const password = credentials.password as string;
                const type = (credentials.userType as string || "STUDENT").toUpperCase();

                console.log("[AUTH] Attempting login:", { email, type });

                try {
                    if (type === "STUDENT") {
                        const student = await prisma.student.findUnique({
                            where: { EmailAddress: email },
                        });

                        if (!student) {
                            console.log("[AUTH] Student not found:", email);
                            return null;
                        }

                        const isValid = await bcrypt.compare(password, student.Password);
                        console.log("[AUTH] Student password valid:", isValid);

                        if (!isValid) return null;

                        return {
                            id: student.StudentID.toString(),
                            name: student.StudentName,
                            email: student.EmailAddress,
                            role: "STUDENT",
                        };
                    } else {
                        // type is ADMIN or MENTOR
                        const staff = await prisma.staff.findUnique({
                            where: { EmailAddress: email },
                        });

                        if (!staff) {
                            console.log("[AUTH] Staff not found:", email);
                            return null;
                        }

                        console.log("[AUTH] Staff record found. Role in DB:", staff.Role);

                        const isValid = await bcrypt.compare(password, staff.Password);
                        console.log("[AUTH] Staff password valid:", isValid);

                        if (!isValid) return null;

                        // Case-insensitive role check
                        const dbRole = staff.Role.toUpperCase();
                        if (dbRole !== type) {
                            console.log(`[AUTH] Role mismatch: DB says ${dbRole}, requested ${type}`);
                            return null;
                        }

                        return {
                            id: staff.StaffID.toString(),
                            name: staff.StaffName,
                            email: staff.EmailAddress,
                            role: dbRole,
                        };
                    }
                } catch (err) {
                    console.error("[AUTH] Database or bcrypt error:", err);
                    return null;
                }
            },
        }),
    ],
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
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
});
