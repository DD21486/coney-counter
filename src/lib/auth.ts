import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        session.user.isApproved = token.isApproved;
        session.user.role = token.role;
        session.user.isBanned = token.isBanned;
        session.user.username = token.username;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        // Create or update user in database
        const dbUser = await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            isApproved: false, // New users start unapproved
            role: 'user',
            isBanned: false,
          },
        });
        
        token.sub = dbUser.id;
        token.isApproved = dbUser.isApproved;
        token.role = dbUser.role;
        token.isBanned = dbUser.isBanned;
        token.username = dbUser.username;
      } else if (token.sub) {
        // Refresh user data from database on every request
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            isApproved: true,
            role: true,
            isBanned: true,
            username: true,
          },
        });
        
        if (dbUser) {
          token.isApproved = dbUser.isApproved;
          token.role = dbUser.role;
          token.isBanned = dbUser.isBanned;
          token.username = dbUser.username;
        }
      }
      return token;
    },
    // redirect: async ({ url, baseUrl }) => {
    //   // If it's a sign-out, go to home
    //   if (url.includes('/api/auth/signout')) {
    //     return baseUrl;
    //   }
    //   // For successful Google OAuth callbacks, go to dashboard
    //   if (url.includes('/api/auth/callback/google') && !url.includes('error=')) {
    //     return `${baseUrl}/dashboard`;
    //   }
    //   // Allow the initial Google sign-in URL to pass through
    //   if (url.includes('/api/auth/signin/google')) {
    //     return url;
    //   }
    //   // Otherwise, use the provided URL
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === "google") {
        // Allow all users to sign in - we'll check approval status in the session callback
        return true;
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
}
