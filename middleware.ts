import NextAuth from 'next-auth'
import authConfig from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const estaLogueado = !!req.auth
  const esAdmin = req.nextUrl.pathname.startsWith('/admin')

  if (esAdmin && !estaLogueado) {
    return Response.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
