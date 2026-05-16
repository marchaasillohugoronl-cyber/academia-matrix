'use server'
import { db }              from '@/lib/db'
import { alumnos }         from '@/lib/db/schema'
import { eq }              from 'drizzle-orm'
import { revalidatePath }  from 'next/cache'
import { getAlumnoSesion } from '@/lib/portal-session'
import bcrypt              from 'bcryptjs'

export type ResultadoPerfil =
  | { ok: true;  mensaje: string }
  | { ok: false; error: string }

export async function actualizarPerfil(
  _prev: ResultadoPerfil | null,
  data: FormData,
): Promise<ResultadoPerfil> {
  const alumno = await getAlumnoSesion()
  if (!alumno) return { ok: false, error: 'Sesión no válida. Inicia sesión nuevamente.' }

  const nombre               = (data.get('nombre')        as string)?.trim()
  const apellidos            = (data.get('apellidos')     as string)?.trim()
  const fechaNacimiento      = (data.get('fechaNacimiento') as string)?.trim()
  const telefono             = (data.get('telefono')      as string)?.trim() || null
  const emailPersonal        = (data.get('emailPersonal') as string)?.trim() || null
  const direccion            = (data.get('direccion')     as string)?.trim() || null
  const apoderado            = (data.get('apoderado')     as string)?.trim() || null
  const telefonoApoderado    = (data.get('telefonoApoderado') as string)?.trim() || null
  const aceptoNotificaciones = data.get('notificaciones') === 'on'
  const emailAcademia        = (data.get('emailAcademia') as string)?.trim().toLowerCase() || null
  const nuevaPassword        = (data.get('nuevaPassword') as string)?.trim()
  const confirmarPassword    = (data.get('confirmarPassword') as string)?.trim()

  if (!nombre || !apellidos || !fechaNacimiento)
    return { ok: false, error: 'Nombre, apellidos y fecha de nacimiento son obligatorios.' }

  if (emailPersonal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPersonal))
    return { ok: false, error: 'El correo personal no tiene un formato válido.' }

  if (telefono && !/^\d{7,15}$/.test(telefono.replace(/[\s\-+()]/g, '')))
    return { ok: false, error: 'El teléfono no tiene un formato válido.' }

  if (emailAcademia && !emailAcademia.endsWith('@academiamatrix.com'))
    return { ok: false, error: 'El correo institucional debe terminar en @academiamatrix.com' }

  if (nuevaPassword) {
    if (nuevaPassword.length < 6)
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
    if (nuevaPassword !== confirmarPassword)
      return { ok: false, error: 'Las contraseñas no coinciden.' }
  }

  const cambios: Record<string, unknown> = {
    nombre, apellidos, fechaNacimiento,
    telefono, emailPersonal, direccion, apoderado, telefonoApoderado,
    aceptoNotificaciones,
  }

  if (emailAcademia) cambios.emailAcademia = emailAcademia
  if (nuevaPassword) cambios.passwordHash  = await bcrypt.hash(nuevaPassword, 10)

  await db.update(alumnos).set(cambios).where(eq(alumnos.id, alumno.id))

  revalidatePath('/portal/perfil')
  revalidatePath('/portal/dashboard')

  return { ok: true, mensaje: 'Perfil actualizado correctamente.' }
}
