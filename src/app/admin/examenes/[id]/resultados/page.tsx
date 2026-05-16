import { db }                                        from '@/lib/db'
import { examenes, entregasExamen, alumnos, preguntasExamen } from '@/lib/db/schema'
import { eq, desc }                                   from 'drizzle-orm'
import { notFound }                                   from 'next/navigation'
import Link                                           from 'next/link'
import { ArrowLeft, Users, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import styles from './resultados.module.css'

export const dynamic = 'force-dynamic'

export default async function ResultadosExamen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [examen] = await db.select().from(examenes).where(eq(examenes.id, id)).limit(1)
  if (!examen) notFound()

  const preguntas = await db
    .select()
    .from(preguntasExamen)
    .where(eq(preguntasExamen.examenId, id))
    .orderBy(preguntasExamen.orden)

  const puntajeTotal = preguntas.reduce((s, p) => s + (p.puntaje ?? 1), 0)

  // Entregas con datos del alumno
  const entregas = await db
    .select({
      id:           entregasExamen.id,
      respuestas:   entregasExamen.respuestas,
      puntajeAuto:  entregasExamen.puntajeAuto,
      puntajeFinal: entregasExamen.puntajeFinal,
      calificado:   entregasExamen.calificado,
      enviadoEn:    entregasExamen.enviadoEn,
      alumnoId:     entregasExamen.alumnoId,
      nombre:       alumnos.nombre,
      apellidos:    alumnos.apellidos,
      dni:          alumnos.dni,
    })
    .from(entregasExamen)
    .leftJoin(alumnos, eq(entregasExamen.alumnoId, alumnos.id))
    .where(eq(entregasExamen.examenId, id))
    .orderBy(desc(entregasExamen.enviadoEn))

  const promedio = entregas.length
    ? Math.round(entregas.reduce((s, e) => s + (e.puntajeAuto ?? 0), 0) / entregas.length)
    : 0

  function pct(pts: number | null) {
    if (!puntajeTotal || pts === null) return 0
    return Math.round((pts / puntajeTotal) * 100)
  }

  return (
    <div className={styles.page}>
      <Link href={`/admin/examenes/${id}`} className={styles.btnVolver}>
        <ArrowLeft size={13} /> Volver al examen
      </Link>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.titulo}>{examen.titulo}</h1>
          <p className={styles.sub}>
            Resultados · {entregas.length} entregas · {preguntas.length} preguntas · {puntajeTotal} pts totales
          </p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{entregas.length}</span>
          <span className={styles.statLabel}>Entregas</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{promedio}</span>
          <span className={styles.statLabel}>Prom. auto</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{pct(promedio)}%</span>
          <span className={styles.statLabel}>% promedio</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>
            {entregas.filter((e) => pct(e.puntajeAuto) >= 60).length}
          </span>
          <span className={styles.statLabel}>Aprobados ≥60%</span>
        </div>
      </div>

      {/* Tabla de entregas */}
      {entregas.length === 0 ? (
        <div className={styles.vacio}>
          <Users size={40} strokeWidth={1} />
          <p>Ningún alumno ha entregado este examen todavía.</p>
        </div>
      ) : (
        <div className={styles.tabla}>
          <div className={styles.tablaHead}>
            <span>Alumno</span>
            <span>DNI</span>
            <span>Puntaje</span>
            <span>%</span>
            <span>Estado</span>
            <span>Fecha</span>
            <span></span>
          </div>
          {entregas.map((e) => {
            const p = pct(e.puntajeAuto)
            const aprobado = p >= 60
            return (
              <div key={e.id} className={styles.tablaFila}>
                <span className={styles.alumnoNombre}>
                  {e.nombre} {e.apellidos}
                </span>
                <span className={styles.cellMono}>{e.dni ?? '—'}</span>
                <span className={styles.cellPts}>
                  {e.puntajeAuto ?? '—'} / {puntajeTotal}
                </span>
                <span className={aprobado ? styles.pctOk : styles.pctMal}>{p}%</span>
                <span>
                  {e.calificado
                    ? <span className={styles.badgeOk}><CheckCircle2 size={11} /> Calificado</span>
                    : <span className={styles.badgePend}><Clock size={11} /> Pendiente</span>}
                </span>
                <span className={styles.cellFecha}>
                  {e.enviadoEn
                    ? new Date(e.enviadoEn).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
                    : '—'}
                </span>
                <Link
                  href={`/admin/examenes/${id}/resultados/${e.id}`}
                  className={styles.btnDetalle}
                  title="Ver respuestas"
                >
                  <ChevronRight size={14} />
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* Por pregunta */}
      <h2 className={styles.secLabel}>Análisis por pregunta</h2>
      <div className={styles.preguntasResumen}>
        {preguntas.map((p, i) => {
          const respuestasP = entregas
            .map((e) => (e.respuestas as Record<string, string> | null)?.[p.id])
            .filter(Boolean) as string[]

          const correctas = p.tipo === 'multiple'
            ? respuestasP.filter((r) => r === p.respuestaCorrecta).length
            : null

          const pctCorr = correctas !== null && entregas.length
            ? Math.round((correctas / entregas.length) * 100)
            : null

          return (
            <div key={p.id} className={styles.pregResumen}>
              <div className={styles.pregResumenHead}>
                <span className={styles.pregNum}>{i + 1}</span>
                <p className={styles.pregTexto}>{p.enunciado}</p>
                <span className={styles.pregTipo}>
                  {p.tipo === 'multiple' ? 'Múltiple' : 'Libre'}
                </span>
              </div>
              {pctCorr !== null && (
                <div className={styles.barraWrap}>
                  <div
                    className={styles.barra}
                    style={{ width: `${pctCorr}%`, background: pctCorr >= 60 ? 'var(--acento)' : '#f87171' }}
                  />
                  <span className={styles.barraPct}>{pctCorr}% correctas ({correctas}/{entregas.length})</span>
                </div>
              )}
              {p.tipo === 'texto' && (
                <p className={styles.libresNota}>{respuestasP.length} respuestas escritas</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
