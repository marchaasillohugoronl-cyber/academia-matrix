'use server'
import { db }                    from '@/lib/db'
import { alumnos }               from '@/lib/db/schema'
import { eq }                    from 'drizzle-orm'
import { redirect }              from 'next/navigation'
import bcrypt                    from 'bcryptjs'
import { setPortalSession, clearPortalSession, getAlumnoSesion } from '@/lib/portal-session'

export type ErrorLogin = string | null

export async function loginPortal(
  _prev: ErrorLogin,
  data: FormData,
): Promise<ErrorLogin> {
  const email    = (data.get('email')    as string)?.trim().toLowerCase()
  const password = (data.get('password') as string)

  if (!email || !password) return 'Completa todos los campos.'

  const [alumno] = await db
    .select({
      id:            alumnos.id,
      activo:        alumnos.activo,
      passwordHash:  alumnos.passwordHash,
      aceptoTerminos: alumnos.aceptoTerminos,
    })
    .from(alumnos)
    .where(eq(alumnos.emailAcademia, email))
    .limit(1)

  if (!alumno || !alumno.activo || !alumno.passwordHash)
    return 'Correo o contraseña incorrectos.'

  const valido = await bcrypt.compare(password, alumno.passwordHash)
  if (!valido) return 'Correo o contraseña incorrectos.'

  await setPortalSession(alumno.id)

  if (!alumno.aceptoTerminos) redirect('/portal/bienvenida')
  redirect('/portal/dashboard')
}

export async function logoutPortal() {
  await clearPortalSession()
  redirect('/')
}

export type ResultadoPoliticas =
  | { ok: true }
  | { ok: false; error: string }

export async function aceptarPoliticas(
  _prev: ResultadoPoliticas | null,
  data: FormData,
): Promise<ResultadoPoliticas> {
  const alumno = await getAlumnoSesion()
  if (!alumno) return { ok: false, error: 'Sesión no válida. Inicia sesión nuevamente.' }

  const terminos       = data.get('terminos')       === 'on'
  const notificaciones = data.get('notificaciones') === 'on'

  if (!terminos)
    return { ok: false, error: 'Debes aceptar los términos y condiciones para continuar.' }

  await db
    .update(alumnos)
    .set({
      aceptoTerminos:       true,
      aceptoNotificaciones: notificaciones,
      primerLogin:          false,
    })
    .where(eq(alumnos.id, alumno.id))

  redirect('/portal/dashboard')
}
