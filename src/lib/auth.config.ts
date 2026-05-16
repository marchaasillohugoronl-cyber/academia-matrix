import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Configuración compatible con Edge Runtime (sin bcrypt)
export default {
  providers: [Credentials({})],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig
