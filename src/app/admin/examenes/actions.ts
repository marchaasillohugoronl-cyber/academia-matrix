'use server'
import { db }                     from '@/lib/db'
import { examenes, preguntasExamen } from '@/lib/db/schema'
import { eq }                     from 'drizzle-orm'
import { revalidatePath }         from 'next/cache'

export async function crearExamen(data: FormData) {
  const titulo          = (data.get('titulo')          as string)?.trim()
  const descripcion     = (data.get('descripcion')     as string)?.trim()
  const duracionMinutos = parseInt(data.get('duracionMinutos') as string) || 30
  if (!titulo) return { error: 'El título es obligatorio.' }
  const [examen] = await db.insert(examenes)
    .values({ titulo, descripcion: descripcion || null, duracionMinutos })
    .returning({ id: examenes.id })
  revalidatePath('/admin/examenes')
  return { ok: true, id: examen.id }
}

export async function toggleExamen(id: string, activo: boolean) {
  await db.update(examenes).set({ activo }).where(eq(examenes.id, id))
  revalidatePath('/admin/examenes')
  revalidatePath(`/admin/examenes/${id}`)
}

export async function eliminarExamen(id: string) {
  await db.delete(examenes).where(eq(examenes.id, id))
  revalidatePath('/admin/examenes')
}

export async function agregarPregunta(examenId: string, data: FormData) {
  const enunciado = (data.get('enunciado') as string)?.trim()
  const tipo      = (data.get('tipo')      as string) ?? 'multiple'
  const puntaje   = parseInt(data.get('puntaje') as string) || 1
  if (!enunciado) return { error: 'El enunciado es obligatorio.' }

  let opciones: string[] | null = null
  let respuestaCorrecta: string | null = null

  if (tipo === 'multiple') {
    const a = (data.get('opcionA') as string)?.trim() ?? ''
    const b = (data.get('opcionB') as string)?.trim() ?? ''
    const c = (data.get('opcionC') as string)?.trim() ?? ''
    const d = (data.get('opcionD') as string)?.trim() ?? ''
    opciones = [a, b, c, d]
    respuestaCorrecta = (data.get('correcta') as string)?.trim() ?? '0'
  }

  await db.insert(preguntasExamen).values({
    examenId,
    enunciado,
    tipo,
    opciones,
    respuestaCorrecta,
    puntaje,
  })
  revalidatePath(`/admin/examenes/${examenId}`)
  return { ok: true }
}

export async function eliminarPregunta(id: string, examenId: string) {
  await db.delete(preguntasExamen).where(eq(preguntasExamen.id, id))
  revalidatePath(`/admin/examenes/${examenId}`)
}
