import { cookies }  from 'next/headers'
import { createHmac } from 'crypto'
import { db }         from './db'
import { alumnos }    from './db/schema'
import { eq }         from 'drizzle-orm'

const SECRET      = process.env.AUTH_SECRET ?? 'portal-secret'
const COOKIE_NAME = 'portal_session'
const MAX_AGE     = 60 * 60 * 24 * 7   // 7 días

function firmar(valor: string) {
  return createHmac('sha256', SECRET).update(valor).digest('hex')
}

export async function setPortalSession(alumnoId: string) {
  const sig   = firmar(alumnoId)
  const store = await cookies()
  store.set(COOKIE_NAME, `${alumnoId}.${sig}`, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/',
  })
}

export async function clearPortalSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getAlumnoSesion() {
  const store = await cookies()
  const raw   = store.get(COOKIE_NAME)?.value
  if (!raw) return null

  const dot      = raw.lastIndexOf('.')
  if (dot === -1) return null
  const alumnoId = raw.slice(0, dot)
  const sig      = raw.slice(dot + 1)
  if (firmar(alumnoId) !== sig) return null

  const [alumno] = await db
    .select()
    .from(alumnos)
    .where(eq(alumnos.id, alumnoId))
    .limit(1)

  if (!alumno || !alumno.activo) return null
  return alumno
}
