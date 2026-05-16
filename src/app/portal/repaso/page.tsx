import { db }              from '@/lib/db'
import { preguntasExamen, examenes } from '@/lib/db/schema'
import { eq, asc }         from 'drizzle-orm'
import { redirect }        from 'next/navigation'
import { getAlumnoSesion } from '@/lib/portal-session'
import BotRepaso           from './BotRepaso'

export const dynamic = 'force-dynamic'

export default async function PaginaRepaso() {
  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')

  const examenesActivos = await db
    .select({ id: examenes.id, titulo: examenes.titulo, descripcion: examenes.descripcion })
    .from(examenes)
    .where(eq(examenes.activo, true))

  const examenesConPreguntas = await Promise.all(
    examenesActivos.map(async (ex) => {
      const pregs = await db
        .select()
        .from(preguntasExamen)
        .where(eq(preguntasExamen.examenId, ex.id))
        .orderBy(asc(preguntasExamen.orden))
      return { ...ex, preguntas: pregs }
    })
  )

  // Repaso libre: preguntas múltiple de todos los exámenes, mezcladas
  const soloMultiple = examenesConPreguntas.flatMap((ex) =>
    ex.preguntas
      .filter((p) => p.tipo === 'multiple' && p.respuestaCorrecta !== null)
      .map((p) => ({ ...p, examenTitulo: ex.titulo }))
  )
  const preguntasMezcladas = [...soloMultiple].sort(() => 0.5 - Math.random())

  // Examen guiado: exámenes completos (solo preguntas de opción múltiple)
  const examenesParaBot = examenesConPreguntas
    .map((ex) => ({
      id: ex.id,
      titulo: ex.titulo,
      descripcion: ex.descripcion,
      preguntas: ex.preguntas.filter(
        (p) => p.tipo === 'multiple' && p.respuestaCorrecta !== null
      ),
    }))
    .filter((ex) => ex.preguntas.length > 0)

  return (
    <BotRepaso
      preguntas={preguntasMezcladas}
      alumnoNombre={alumno.nombre}
      examenesDisponibles={examenesParaBot}
    />
  )
}
