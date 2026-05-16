import { getAlumnoSesion }          from '@/lib/portal-session'
import { redirect }                  from 'next/navigation'
import { db }                        from '@/lib/db'
import { anuncios, examenes, encuestas, ciclos, niveles, entregasExamen, respuestasEncuesta } from '@/lib/db/schema'
import { eq, desc }                  from 'drizzle-orm'
import DashboardAlumno               from './DashboardAlumno'

export const dynamic = 'force-dynamic'

export default async function PaginaDashboard() {
  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')
  if (!alumno.aceptoTerminos) redirect('/portal/bienvenida')

  const [
    listaAnuncios, listaExamenes, listaEncuestas,
    listaCiclos, listaNiveles,
    entregasAlumno, respuestasAlumno,
  ] = await Promise.all([
    db.select().from(anuncios).where(eq(anuncios.publicado, true)).orderBy(desc(anuncios.creadoEn)).limit(10),
    db.select().from(examenes).where(eq(examenes.activo, true)).orderBy(desc(examenes.creadoEn)),
    db.select().from(encuestas).where(eq(encuestas.activa, true)).orderBy(desc(encuestas.creadaEn)),
    db.select().from(ciclos),
    db.select().from(niveles),
    db.select({ examenId: entregasExamen.examenId, entregaId: entregasExamen.id })
      .from(entregasExamen).where(eq(entregasExamen.alumnoId, alumno.id)),
    db.selectDistinct({ encuestaId: respuestasEncuesta.encuestaId })
      .from(respuestasEncuesta).where(eq(respuestasEncuesta.alumnoId, alumno.id)),
  ])

  const cicloNombre = listaCiclos.find((c) => c.id === alumno.cicloId)?.nombre  ?? '—'
  const nivelNombre = listaNiveles.find((n) => n.id === alumno.nivelId)?.nombre ?? '—'

  const examenesCompletados = Object.fromEntries(
    entregasAlumno.map((e) => [e.examenId, e.entregaId])
  )
  const encuestasCompletadas = new Set(respuestasAlumno.map((r) => r.encuestaId))

  return (
    <DashboardAlumno
      alumno={{ ...alumno, cicloNombre, nivelNombre, fotoUrl: alumno.fotoUrl ?? null }}
      anuncios={listaAnuncios}
      examenes={listaExamenes}
      encuestas={listaEncuestas}
      examenesCompletados={examenesCompletados}
      encuestasCompletadas={[...encuestasCompletadas]}
    />
  )
}
