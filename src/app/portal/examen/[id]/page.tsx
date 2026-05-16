import { db }              from '@/lib/db'
import { examenes, preguntasExamen, entregasExamen } from '@/lib/db/schema'
import { eq, and }         from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { getAlumnoSesion } from '@/lib/portal-session'
import FormExamen          from './FormExamen'

export const dynamic = 'force-dynamic'

export default async function PaginaExamen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')

  const [examen] = await db
    .select()
    .from(examenes)
    .where(eq(examenes.id, id))
    .limit(1)

  if (!examen || !examen.activo) notFound()

  const [yaEntrego] = await db
    .select({ id: entregasExamen.id })
    .from(entregasExamen)
    .where(and(
      eq(entregasExamen.examenId, id),
      eq(entregasExamen.alumnoId, alumno.id),
    ))
    .limit(1)

  if (yaEntrego) redirect(`/portal/examen/resultado/${yaEntrego.id}`)

  const preguntas = await db
    .select()
    .from(preguntasExamen)
    .where(eq(preguntasExamen.examenId, id))
    .orderBy(preguntasExamen.orden)

  return <FormExamen examen={examen} preguntas={preguntas} />
}
