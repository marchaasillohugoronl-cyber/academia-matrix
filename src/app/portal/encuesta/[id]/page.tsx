import { db }                from '@/lib/db'
import { encuestas, preguntasEncuesta, respuestasEncuesta } from '@/lib/db/schema'
import { eq, and }          from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { getAlumnoSesion }  from '@/lib/portal-session'
import FormEncuesta         from './FormEncuesta'

export const dynamic = 'force-dynamic'

export default async function PaginaEncuesta({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')

  const [encuesta] = await db
    .select()
    .from(encuestas)
    .where(eq(encuestas.id, id))
    .limit(1)

  if (!encuesta || !encuesta.activa) notFound()

  const [yaRespondio] = await db
    .select({ id: respuestasEncuesta.id })
    .from(respuestasEncuesta)
    .where(and(
      eq(respuestasEncuesta.encuestaId, id),
      eq(respuestasEncuesta.alumnoId, alumno.id),
    ))
    .limit(1)

  if (yaRespondio) redirect('/portal/encuesta/ok')

  const preguntas = await db
    .select()
    .from(preguntasEncuesta)
    .where(eq(preguntasEncuesta.encuestaId, id))
    .orderBy(preguntasEncuesta.orden)

  return <FormEncuesta encuesta={encuesta} preguntas={preguntas} />
}
