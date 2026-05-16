'use server'
import { db }       from '@/lib/db'
import { anuncios } from '@/lib/db/schema'
import { eq }       from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function crearAnuncio(data: FormData) {
  const titulo    = (data.get('titulo')    as string)?.trim()
  const contenido = (data.get('contenido') as string)?.trim()
  const publicado = data.get('publicado') === 'on'
  if (!titulo || !contenido) return { error: 'Completa todos los campos.' }
  await db.insert(anuncios).values({ titulo, contenido, publicado })
  revalidatePath('/admin/anuncios')
  return { ok: true }
}

export async function togglePublicado(id: string, publicado: boolean) {
  await db.update(anuncios).set({ publicado }).where(eq(anuncios.id, id))
  revalidatePath('/admin/anuncios')
}

export async function eliminarAnuncio(id: string) {
  await db.delete(anuncios).where(eq(anuncios.id, id))
  revalidatePath('/admin/anuncios')
}
