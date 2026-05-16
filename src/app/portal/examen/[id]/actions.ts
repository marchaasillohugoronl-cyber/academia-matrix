'use server'
import { db }                             from '@/lib/db'
import { preguntasExamen, entregasExamen } from '@/lib/db/schema'
import { eq, and }                        from 'drizzle-orm'
import { getAlumnoSesion }               from '@/lib/portal-session'
import { redirect }                       from 'next/navigation'
import { revalidatePath }                 from 'next/cache'

export async function entregarExamen(examenId: string, data: FormData) {
  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')

  const [yaEntrego] = await db
    .select({ id: entregasExamen.id })
    .from(entregasExamen)
    .where(and(
      eq(entregasExamen.examenId, examenId),
      eq(entregasExamen.alumnoId, alumno.id),
    ))
    .limit(1)

  if (yaEntrego) redirect(`/portal/examen/resultado/${yaEntrego.id}`)

  const preguntas = await db
    .select()
    .from(preguntasExamen)
    .where(eq(preguntasExamen.examenId, examenId))

  // Construir mapa de respuestas { preguntaId → respuesta }
  const respuestas: Record<string, string> = {}
  for (const p of preguntas) {
    const val = data.get(`p_${p.id}`)
    if (val) respuestas[p.id] = val.toString()
  }

  // Auto-calificar preguntas múltiple
  let puntajeAuto = 0
  for (const p of preguntas) {
    if (p.tipo === 'multiple' && p.respuestaCorrecta !== null) {
      if (respuestas[p.id] === p.respuestaCorrecta) {
        puntajeAuto += p.puntaje ?? 1
      }
    }
  }

  const [entrega] = await db
    .insert(entregasExamen)
    .values({ examenId, alumnoId: alumno.id, respuestas, puntajeAuto, calificado: false })
    .returning({ id: entregasExamen.id })

  revalidatePath('/portal/dashboard')
  redirect(`/portal/examen/resultado/${entrega.id}`)
}
