'use server'
import { db }              from '@/lib/db'
import { entregasExamen }  from '@/lib/db/schema'
import { eq, and }         from 'drizzle-orm'
import { getAlumnoSesion } from '@/lib/portal-session'
import { revalidatePath }  from 'next/cache'

export async function guardarResultadoBot(
  examenId: string,
  respuestas: Record<string, string>,
  puntajeAuto: number,
) {
  const alumno = await getAlumnoSesion()
  if (!alumno) return

  // Solo guarda si no existe entrega previa (primer intento)
  const existente = await db
    .select({ id: entregasExamen.id })
    .from(entregasExamen)
    .where(and(eq(entregasExamen.examenId, examenId), eq(entregasExamen.alumnoId, alumno.id)))
    .limit(1)

  if (existente.length > 0) return

  await db.insert(entregasExamen).values({
    examenId,
    alumnoId: alumno.id,
    respuestas,
    puntajeAuto,
    calificado: false,
  })

  revalidatePath('/admin/examenes')
}
