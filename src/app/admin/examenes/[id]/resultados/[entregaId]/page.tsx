import { db }                                          from '@/lib/db'
import { entregasExamen, preguntasExamen, alumnos, examenes } from '@/lib/db/schema'
import { eq }                                           from 'drizzle-orm'
import { notFound }                                    from 'next/navigation'
import Link                                            from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle }            from 'lucide-react'
import styles from '../resultados.module.css'
import detalleStyles from './detalle.module.css'

export const dynamic = 'force-dynamic'

const LETRAS = ['A', 'B', 'C', 'D']

export default async function DetalleEntrega({
  params,
}: { params: Promise<{ id: string; entregaId: string }> }) {
  const { id, entregaId } = await params

  const [examen] = await db.select().from(examenes).where(eq(examenes.id, id)).limit(1)
  if (!examen) notFound()

  const [entrega] = await db
    .select({
      id:           entregasExamen.id,
      respuestas:   entregasExamen.respuestas,
      puntajeAuto:  entregasExamen.puntajeAuto,
      puntajeFinal: entregasExamen.puntajeFinal,
      calificado:   entregasExamen.calificado,
      enviadoEn:    entregasExamen.enviadoEn,
      nombre:       alumnos.nombre,
      apellidos:    alumnos.apellidos,
      dni:          alumnos.dni,
    })
    .from(entregasExamen)
    .leftJoin(alumnos, eq(entregasExamen.alumnoId, alumnos.id))
    .where(eq(entregasExamen.id, entregaId))
    .limit(1)

  if (!entrega) notFound()

  const preguntas = await db
    .select()
    .from(preguntasExamen)
    .where(eq(preguntasExamen.examenId, id))
    .orderBy(preguntasExamen.orden)

  const puntajeTotal = preguntas.reduce((s, p) => s + (p.puntaje ?? 1), 0)
  const respuestas = (entrega.respuestas ?? {}) as Record<string, string>
  const pct = puntajeTotal ? Math.round(((entrega.puntajeAuto ?? 0) / puntajeTotal) * 100) : 0

  return (
    <div className={styles.page}>
      <Link href={`/admin/examenes/${id}/resultados`} className={styles.btnVolver}>
        <ArrowLeft size={13} /> Resultados del examen
      </Link>

      {/* Cabecera del alumno */}
      <div className={detalleStyles.alumnoCard}>
        <div>
          <p className={detalleStyles.alumnoNombre}>{entrega.nombre} {entrega.apellidos}</p>
          <p className={detalleStyles.alumnoDni}>DNI {entrega.dni}</p>
        </div>
        <div className={detalleStyles.scoreBox}>
          <span className={detalleStyles.scoreNum}>{entrega.puntajeAuto ?? '—'}</span>
          <span className={detalleStyles.scoreTotal}>/ {puntajeTotal} pts</span>
          <span className={pct >= 60 ? detalleStyles.pctOk : detalleStyles.pctMal}>{pct}%</span>
        </div>
      </div>

      {/* Preguntas con respuestas */}
      <ol className={detalleStyles.lista}>
        {preguntas.map((p, i) => {
          const respAlumno  = respuestas[p.id]
          const esCorrecta  = p.tipo === 'multiple'
            ? respAlumno === p.respuestaCorrecta
            : null

          return (
            <li key={p.id} className={`${detalleStyles.item} ${
              esCorrecta === true  ? detalleStyles.itemOk  :
              esCorrecta === false ? detalleStyles.itemMal : ''
            }`}>
              <div className={detalleStyles.itemHead}>
                <span className={detalleStyles.num}>{i + 1}</span>
                <p className={detalleStyles.enunciado}>{p.enunciado}</p>
                {esCorrecta !== null && (
                  <span className={detalleStyles.resultado}>
                    {esCorrecta
                      ? <><CheckCircle2 size={14} style={{ color: '#4ade80' }} /> +{p.puntaje ?? 1} pts</>
                      : <><XCircle size={14} style={{ color: '#f87171' }} /> 0 pts</>}
                  </span>
                )}
              </div>

              {p.tipo === 'multiple' && p.opciones && (
                <ul className={detalleStyles.opciones}>
                  {p.opciones.map((op, idx) => {
                    const opIdx   = String(idx)
                    const esCorrIdx = opIdx === p.respuestaCorrecta
                    const esAlumno  = opIdx === respAlumno
                    return op ? (
                      <li key={idx} className={`${detalleStyles.opcion}
                        ${esCorrIdx ? detalleStyles.opcionCorrecta : ''}
                        ${esAlumno && !esCorrIdx ? detalleStyles.opcionMal : ''}
                      `}>
                        <span className={detalleStyles.opLetra}>{LETRAS[idx]}</span>
                        <span className={detalleStyles.opTexto}>{op}</span>
                        {esCorrIdx && <CheckCircle2 size={13} style={{ color: '#4ade80', flexShrink: 0 }} />}
                        {esAlumno && !esCorrIdx && <XCircle size={13} style={{ color: '#f87171', flexShrink: 0 }} />}
                      </li>
                    ) : null
                  })}
                </ul>
              )}

              {p.tipo === 'texto' && (
                <div className={detalleStyles.textoRespuesta}>
                  <p className={detalleStyles.textoLabel}>Respuesta del alumno:</p>
                  <p className={detalleStyles.textoVal}>{respAlumno || <em>Sin respuesta</em>}</p>
                  {p.respuestaCorrecta && (
                    <>
                      <p className={detalleStyles.textoLabel} style={{ marginTop: 8 }}>Respuesta esperada:</p>
                      <p className={detalleStyles.textoCorrecta}>{p.respuestaCorrecta}</p>
                    </>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
