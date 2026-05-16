'use server'
import { db }                    from '@/lib/db'
import { encuestas, preguntasEncuesta } from '@/lib/db/schema'
import { eq }                    from 'drizzle-orm'
import { revalidatePath }        from 'next/cache'

export async function crearEncuesta(data: FormData) {
  const titulo      = (data.get('titulo')      as string)?.trim()
  const descripcion = (data.get('descripcion') as string)?.trim()
  if (!titulo) return { error: 'El título es obligatorio.' }
  const [enc] = await db.insert(encuestas)
    .values({ titulo, descripcion: descripcion || null })
    .returning({ id: encuestas.id })
  revalidatePath('/admin/encuestas')
  return { ok: true, id: enc.id }
}

export async function toggleEncuesta(id: string, activa: boolean) {
  await db.update(encuestas).set({ activa }).where(eq(encuestas.id, id))
  revalidatePath('/admin/encuestas')
}

export async function eliminarEncuesta(id: string) {
  await db.delete(encuestas).where(eq(encuestas.id, id))
  revalidatePath('/admin/encuestas')
}

export async function agregarPreguntaEncuesta(encuestaId: string, data: FormData) {
  const texto = (data.get('enunciado') as string)?.trim()
  const tipo  = (data.get('tipo')      as string) ?? 'multiple'
  if (!texto) return { error: 'El enunciado es obligatorio.' }

  let opciones: string[] | null = null
  if (tipo === 'multiple') {
    const a = (data.get('opcionA') as string)?.trim() ?? ''
    const b = (data.get('opcionB') as string)?.trim() ?? ''
    const c = (data.get('opcionC') as string)?.trim() ?? ''
    const d = (data.get('opcionD') as string)?.trim() ?? ''
    opciones = [a, b, c, d]
  }

  await db.insert(preguntasEncuesta).values({ encuestaId, texto, tipo, opciones })
  revalidatePath(`/admin/encuestas/${encuestaId}`)
  return { ok: true }
}

export async function eliminarPreguntaEncuesta(id: string, encuestaId: string) {
  await db.delete(preguntasEncuesta).where(eq(preguntasEncuesta.id, id))
  revalidatePath(`/admin/encuestas/${encuestaId}`)
}
