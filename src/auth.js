// auth.js (en la raíz del proyecto)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),

    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email y contraseña son requeridos");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("Credenciales inválidas");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Credenciales inválidas");
                }

                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    role: user.role, 
                };
            },
        }),
    ],

    session: {
        strategy: "jwt", // Usar JWT en lugar de sessions de DB
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },

    callbacks: {
        async jwt({ token, user }) {
            // Primer login
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.firstName = user.firstName;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            // Pasar info del token a la sesión
            if (token && session.user) {
                session.user.id = token.id;
                session.user.firstName = token.firstName;
                session.user.email = token.email;
                session.user.role = token.role;
            }

            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
});