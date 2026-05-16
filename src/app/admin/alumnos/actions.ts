'use server'
import { db }      from '@/lib/db'
import { alumnos } from '@/lib/db/schema'
import { eq }      from 'drizzle-orm'
import bcrypt      from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export type ResultadoCredenciales =
  | { ok: true }
  | { ok: false; error: string }

export type ResultadoEdicion =
  | { ok: true }
  | { ok: false; error: string }

/* ── Guardar credenciales (email + contraseña) ── */
export async function guardarCredencialesAlumno(
  _prev: ResultadoCredenciales | null,
  data: FormData,
): Promise<ResultadoCredenciales> {
  const alumnoId = (data.get('alumnoId') as string)?.trim()
  const email    = (data.get('email')    as string)?.trim().toLowerCase()
  const password = (data.get('password') as string)?.trim()

  if (!alumnoId || !email) return { ok: false, error: 'Faltan datos obligatorios.' }
  if (!email.endsWith('@academiamatrix.com'))
    return { ok: false, error: 'El correo debe terminar en @academiamatrix.com' }

  const updates: { emailAcademia: string; passwordHash?: string } = { emailAcademia: email }

  if (password) {
    if (password.length < 6)
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
    updates.passwordHash = await bcrypt.hash(password, 10)
  }

  await db.update(alumnos).set(updates).where(eq(alumnos.id, alumnoId))
  revalidatePath('/admin/alumnos')
  return { ok: true }
}

/* ── Editar datos completos del alumno ─────────── */
export async function editarAlumno(
  _prev: ResultadoEdicion | null,
  data: FormData,
): Promise<ResultadoEdicion> {
  const id      = (data.get('id')      as string)?.trim()
  const nombre  = (data.get('nombre')  as string)?.trim()
  const apellidos = (data.get('apellidos') as string)?.trim()
  const dni     = (data.get('dni')     as string)?.trim()
  const fechaNacimiento = (data.get('fechaNacimiento') as string)?.trim()
  const telefono        = (data.get('telefono')        as string)?.trim() || null
  const emailPersonal   = (data.get('emailPersonal')   as string)?.trim() || null
  const direccion       = (data.get('direccion')       as string)?.trim() || null
  const apoderado       = (data.get('apoderado')       as string)?.trim() || null
  const telefonoApoderado = (data.get('telefonoApoderado') as string)?.trim() || null
  const cicloId = (data.get('cicloId') as string)?.trim() || null
  const nivelId = (data.get('nivelId') as string)?.trim() || null
  const activo  = data.get('activo') === 'true'

  if (!id || !nombre || !apellidos || !dni || !fechaNacimiento)
    return { ok: false, error: 'Faltan campos obligatorios.' }
  if (!/^\d{8}$/.test(dni))
    return { ok: false, error: 'El DNI debe tener 8 dígitos.' }

  await db.update(alumnos).set({
    nombre, apellidos, dni, fechaNacimiento,
    telefono, emailPersonal, direccion,
    apoderado, telefonoApoderado,
    cicloId, nivelId, activo,
  }).where(eq(alumnos.id, id))

  revalidatePath('/admin/alumnos')
  return { ok: true }
}

/* ── Eliminar alumno ────────────────────────────── */
export async function eliminarAlumno(id: string): Promise<ResultadoEdicion> {
  if (!id) return { ok: false, error: 'ID inválido.' }
  await db.delete(alumnos).where(eq(alumnos.id, id))
  revalidatePath('/admin/alumnos')
  return { ok: true }
}
