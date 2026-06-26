import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { DemoUser, UserRole } from './types'

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'brand-1',
    email: 'brand@pintal.id',
    password: 'demo123',
    name: 'Arini Kusuma',
    role: 'brand',
    organizationName: 'Sanggar Wastra Nusantara',
    city: 'Jakarta',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'artisan-1',
    email: 'artisan@pintal.id',
    password: 'demo123',
    name: 'Ibu Maria Mbiri',
    role: 'artisan',
    organizationName: 'Sanggar Tenun Sumba',
    city: 'Waingapu, NTT',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'auditor-1',
    email: 'auditor@pintal.id',
    password: 'demo123',
    name: 'Ahmad Fauzi',
    role: 'lsm_auditor',
    organizationName: 'LSM Tunas Nusantara',
    city: 'Jawa & Bali',
    createdAt: new Date('2024-01-01'),
  },
]

declare module 'next-auth' {
  interface User {
    role: UserRole
    organizationName: string
    city: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      organizationName: string
      city: string
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: UserRole
    organizationName?: string
    city?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || 'pintal-demo-secret-change-in-production',
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        const role = credentials?.role as UserRole

        const user = DEMO_USERS.find(
          (u) => u.email === email && u.password === password && u.role === role,
        )
        if (!user) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationName: user.organizationName,
          city: user.city,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.organizationName = user.organizationName
        token.city = user.city
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role as UserRole
        session.user.organizationName = token.organizationName as string
        session.user.city = token.city as string
      }
      return session
    },
  },
  trustHost: true,
})
