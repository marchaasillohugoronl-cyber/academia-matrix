import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import authConfig from './auth.config'
import { getDb } from './db'
import { usuarios } from './db/schema'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const email    = credentials?.email    as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        const db = getDb()
        const [usuario] = await db
          .select()
          .from(usuarios)
          .where(eq(usuarios.email, email))
          .limit(1)

        if (!usuario || !usuario.activo) return null

        const valido = await bcrypt.compare(password, usuario.passwordHash)
        if (!valido) return null

        return { id: usuario.id, email: usuario.email, name: usuario.nombre }
      },
    }),
  ],
})
