import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { prisma } from "@/lib/prisma"

// Erweitern Sie die Session-Types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
    } & DefaultSession["user"]
  }

  interface User {
    username: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          username: user.username
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          ...session.user
        }
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 