'use server'
import { db }      from '@/lib/db'
import { alumnos } from '@/lib/db/schema'
import { eq }      from 'drizzle-orm'
import bcrypt      from 'bcryptjs'

const DOMINIO = 'academiamatrix.com'

export type ResultadoRegistro =
  | { ok: true;  nombre: string; emailAcademia: string }
  | { ok: false; error: string }

function normalizarTexto(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]/g, '')
}

async function generarEmailAcademia(nombre: string, apellidos: string): Promise<string> {
  const primerNombre   = normalizarTexto(nombre.split(' ')[0])
  const primerApellido = normalizarTexto(apellidos.split(' ')[0])
  const base = `${primerNombre}.${primerApellido}`

  const candidato = `${base}@${DOMINIO}`
  const existente = await db
    .select({ id: alumnos.id })
    .from(alumnos)
    .where(eq(alumnos.emailAcademia, candidato))
    .limit(1)

  if (existente.length === 0) return candidato

  for (let i = 2; i <= 99; i++) {
    const alt = `${base}${i}@${DOMINIO}`
    const ex  = await db
      .select({ id: alumnos.id })
      .from(alumnos)
      .where(eq(alumnos.emailAcademia, alt))
      .limit(1)
    if (ex.length === 0) return alt
  }
  return `${base}.${Date.now()}@${DOMINIO}`
}

export async function registrarAlumno(
  _prev: ResultadoRegistro | null,
  data: FormData,
): Promise<ResultadoRegistro> {
  const dni              = (data.get('dni')              as string)?.trim()
  const nombre           = (data.get('nombre')           as string)?.trim()
  const apellidos        = (data.get('apellidos')        as string)?.trim()
  const fechaNacimiento  = (data.get('fechaNacimiento')  as string)?.trim()
  const telefono         = (data.get('telefono')         as string)?.trim()
  const cicloId          = (data.get('cicloId')          as string)?.trim()
  const nivelId          = (data.get('nivelId')          as string)?.trim()
  const password         = (data.get('password')         as string)
  const confirmPassword  = (data.get('confirmPassword')  as string)

  if (!dni || !/^\d{8}$/.test(dni))
    return { ok: false, error: 'El DNI debe tener exactamente 8 dígitos numéricos.' }
  if (!nombre || nombre.length < 2)
    return { ok: false, error: 'Ingresa tu nombre.' }
  if (!apellidos || apellidos.length < 2)
    return { ok: false, error: 'Ingresa tus apellidos.' }
  if (!fechaNacimiento)
    return { ok: false, error: 'Ingresa tu fecha de nacimiento.' }
  if (!cicloId)
    return { ok: false, error: 'Selecciona el ciclo al que deseas inscribirte.' }
  if (!nivelId)
    return { ok: false, error: 'Selecciona tu nivel académico.' }
  if (!password || password.length < 6)
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
  if (password !== confirmPassword)
    return { ok: false, error: 'Las contraseñas no coinciden.' }

  const existente = await db
    .select({ id: alumnos.id })
    .from(alumnos)
    .where(eq(alumnos.dni, dni))
    .limit(1)

  if (existente.length > 0)
    return { ok: false, error: 'Ya existe un registro con ese número de DNI.' }

  const emailAcademia = await generarEmailAcademia(nombre, apellidos)
  const passwordHash  = await bcrypt.hash(password, 10)

  await db.insert(alumnos).values({
    dni,
    nombre,
    apellidos,
    fechaNacimiento,
    telefono:             telefono || null,
    cicloId,
    nivelId,
    emailAcademia,
    passwordHash,
    primerLogin:          true,
    aceptoTerminos:       false,
    aceptoNotificaciones: false,
  })

  return { ok: true, nombre, emailAcademia }
}
