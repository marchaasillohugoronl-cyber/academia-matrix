'use server'
import { db }             from '@/lib/db'
import { alumnos }        from '@/lib/db/schema'
import { eq }             from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getAlumnoSesion } from '@/lib/portal-session'
import cloudinary        from '@/lib/cloudinary'

export type ResultadoFoto =
  | { ok: true;  url: string }
  | { ok: false; error: string }

export async function subirFoto(
  _prev: ResultadoFoto | null,
  data: FormData,
): Promise<ResultadoFoto> {
  const alumno = await getAlumnoSesion()
  if (!alumno) return { ok: false, error: 'Sesión no válida.' }

  const archivo = data.get('foto') as File | null
  if (!archivo || archivo.size === 0) return { ok: false, error: 'No se seleccionó ningún archivo.' }
  if (!archivo.type.startsWith('image/')) return { ok: false, error: 'El archivo debe ser una imagen.' }
  if (archivo.size > 5 * 1024 * 1024) return { ok: false, error: 'La imagen no puede superar 5 MB.' }

  const bytes  = await archivo.arrayBuffer()
  const base64 = `data:${archivo.type};base64,${Buffer.from(bytes).toString('base64')}`

  let uploadResult: { secure_url: string }
  try {
    uploadResult = await cloudinary.uploader.upload(base64, {
      folder:         'academia-matrix/alumnos',
      public_id:      alumno.id,
      overwrite:      true,
      transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al subir la imagen.'
    return { ok: false, error: msg }
  }

  await db.update(alumnos)
    .set({ fotoUrl: uploadResult.secure_url })
    .where(eq(alumnos.id, alumno.id))

  revalidatePath('/portal/perfil')
  revalidatePath('/portal/dashboard')
  return { ok: true, url: uploadResult.secure_url }
}
