import { db }                         from '@/lib/db'
import { examenes, preguntasExamen }   from '@/lib/db/schema'
import { eq }                          from 'drizzle-orm'
import { notFound }                    from 'next/navigation'
import EditorPreguntas                 from './EditorPreguntas'

export const dynamic = 'force-dynamic'

export default async function PaginaExamen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [examen] = await db.select().from(examenes).where(eq(examenes.id, id)).limit(1)
  if (!examen) notFound()
  const lista = await db.select().from(preguntasExamen).where(eq(preguntasExamen.examenId, id))
  return <EditorPreguntas examen={examen} preguntas={lista} />
}
