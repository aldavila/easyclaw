import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { onUserSignup } from "./loops";
import { notifyNewUser } from "./notify";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Keep Google for when we have credentials
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "Sign Up", type: "hidden" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        const name = credentials?.name as string;
        const isSignUp = credentials?.isSignUp === "true";

        if (!email || !password) return null;

        const hashedPassword = hashPassword(password);

        try {
          if (isSignUp) {
            // Check if user exists
            const existing = await db.select().from(users).where(eq(users.email, email));
            if (existing.length > 0) {
              console.log("[Auth] User already exists:", email);
              return null; // User already exists
            }

            const [newUser] = await db
              .insert(users)
              .values({
                email,
                name: name || email.split("@")[0],
                passwordHash: hashedPassword,
              })
              .returning();

            console.log("[Auth] Created new user:", newUser.email);
            // Fire-and-forget notifications
            onUserSignup(newUser.email, newUser.name || undefined).catch(() => {});
            notifyNewUser(newUser.email, newUser.name || undefined).catch(() => {});
            return { id: newUser.id, email: newUser.email, name: newUser.name };
          } else {
            // Login
            const [user] = await db.select().from(users).where(eq(users.email, email));
            if (!user || user.passwordHash !== hashedPassword) {
              console.log("[Auth] Invalid credentials for:", email);
              return null;
            }
            console.log("[Auth] Login successful:", user.email);
            return { id: user.id, email: user.email, name: user.name };
          }
        } catch (error) {
          console.error("[Auth] Error during auth:", error);
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
