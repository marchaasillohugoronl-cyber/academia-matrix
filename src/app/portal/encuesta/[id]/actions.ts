'use server'
import { db }                                    from '@/lib/db'
import { preguntasEncuesta, respuestasEncuesta } from '@/lib/db/schema'
import { eq, and }                               from 'drizzle-orm'
import { getAlumnoSesion }                       from '@/lib/portal-session'
import { redirect }                              from 'next/navigation'
import { revalidatePath }                        from 'next/cache'

export async function responderEncuesta(encuestaId: string, data: FormData) {
  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')

  const [yaRespondio] = await db
    .select({ id: respuestasEncuesta.id })
    .from(respuestasEncuesta)
    .where(and(
      eq(respuestasEncuesta.encuestaId, encuestaId),
      eq(respuestasEncuesta.alumnoId, alumno.id),
    ))
    .limit(1)

  if (yaRespondio) redirect('/portal/encuesta/ok')

  const preguntas = await db
    .select()
    .from(preguntasEncuesta)
    .where(eq(preguntasEncuesta.encuestaId, encuestaId))

  const inserts = preguntas
    .map((p) => ({
      encuestaId,
      preguntaId: p.id,
      alumnoId:   alumno.id,
      respuesta:  data.get(`p_${p.id}`)?.toString() ?? null,
    }))
    .filter((r) => r.respuesta !== null && r.respuesta !== '')

  if (inserts.length > 0) {
    await db.insert(respuestasEncuesta).values(inserts)
  }

  revalidatePath('/portal/dashboard')
  redirect('/portal/encuesta/ok')
}
