import { db }                          from '@/lib/db'
import { encuestas, preguntasEncuesta } from '@/lib/db/schema'
import { eq }                           from 'drizzle-orm'
import { notFound }                     from 'next/navigation'
import EditorPreguntasEncuesta          from './EditorPreguntasEncuesta'

export const dynamic = 'force-dynamic'

export default async function PaginaEncuesta({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [encuesta] = await db.select().from(encuestas).where(eq(encuestas.id, id)).limit(1)
  if (!encuesta) notFound()
  const lista = await db.select().from(preguntasEncuesta).where(eq(preguntasEncuesta.encuestaId, id))
  return <EditorPreguntasEncuesta encuesta={encuesta} preguntas={lista} />
}
