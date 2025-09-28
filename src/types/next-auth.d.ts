import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isApproved?: boolean
      role?: string
      isBanned?: boolean
      username?: string | null
    }
  }

  interface User {
    id: string
    isApproved?: boolean
    role?: string
    isBanned?: boolean
    username?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isApproved?: boolean
    role?: string
    isBanned?: boolean
    username?: string | null
  }
}
