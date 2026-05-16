import { db }                                          from '@/lib/db'
import { encuestas, preguntasEncuesta, respuestasEncuesta } from '@/lib/db/schema'
import { eq }                                          from 'drizzle-orm'
import { notFound }                                   from 'next/navigation'
import Link                                           from 'next/link'
import { ArrowLeft, Users }                           from 'lucide-react'
import styles from './resenc.module.css'

export const dynamic = 'force-dynamic'

export default async function ResultadosEncuesta({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [encuesta] = await db.select().from(encuestas).where(eq(encuestas.id, id)).limit(1)
  if (!encuesta) notFound()

  const preguntas = await db
    .select()
    .from(preguntasEncuesta)
    .where(eq(preguntasEncuesta.encuestaId, id))
    .orderBy(preguntasEncuesta.orden)

  const respuestas = await db
    .select()
    .from(respuestasEncuesta)
    .where(eq(respuestasEncuesta.encuestaId, id))

  // Número de alumnos distintos que respondieron
  const respondentes = new Set(respuestas.map((r) => r.alumnoId)).size

  return (
    <div className={styles.page}>
      <Link href={`/admin/encuestas/${id}`} className={styles.btnVolver}>
        <ArrowLeft size={13} /> Volver a la encuesta
      </Link>

      <div className={styles.header}>
        <h1 className={styles.titulo}>{encuesta.titulo}</h1>
        <p className={styles.sub}>
          Resultados · <strong>{respondentes}</strong> alumno{respondentes !== 1 ? 's' : ''} respondieron
        </p>
      </div>

      {respondentes === 0 ? (
        <div className={styles.vacio}>
          <Users size={40} strokeWidth={1} />
          <p>Ningún alumno ha respondido esta encuesta todavía.</p>
        </div>
      ) : (
        <div className={styles.preguntasWrap}>
          {preguntas.map((p, i) => {
            const respsP = respuestas.filter((r) => r.preguntaId === p.id)

            return (
              <div key={p.id} className={styles.pregCard}>
                <div className={styles.pregHead}>
                  <span className={styles.pregNum}>{i + 1}</span>
                  <p className={styles.pregTexto}>{p.texto}</p>
                  <span className={styles.pregTipo}>
                    {p.tipo === 'multiple' ? 'Opción' : p.tipo === 'escala' ? 'Escala' : 'Libre'}
                  </span>
                </div>
                <p className={styles.pregTotal}>{respsP.length} respuestas</p>

                {/* Opción múltiple: conteo por opción */}
                {p.tipo === 'multiple' && p.opciones && (
                  <div className={styles.opcionesRes}>
                    {p.opciones.map((op) => {
                      if (!op) return null
                      const cnt = respsP.filter((r) => r.respuesta === op).length
                      const pct = respsP.length ? Math.round((cnt / respsP.length) * 100) : 0
                      return (
                        <div key={op} className={styles.opcionRow}>
                          <span className={styles.opcionTexto}>{op}</span>
                          <div className={styles.barraOuter}>
                            <div className={styles.barraInner} style={{ width: `${pct}%` }} />
                          </div>
                          <span className={styles.opcionCnt}>{cnt} ({pct}%)</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Escala: promedio + distribución */}
                {p.tipo === 'escala' && (
                  <div className={styles.escalaRes}>
                    <div className={styles.escalaPromedio}>
                      <span className={styles.escalaNum}>
                        {respsP.length
                          ? (respsP.reduce((s, r) => s + Number(r.respuesta ?? 0), 0) / respsP.length).toFixed(1)
                          : '—'}
                      </span>
                      <span className={styles.escalaDe}>/5 promedio</span>
                    </div>
                    <div className={styles.escalaDist}>
                      {[1, 2, 3, 4, 5].map((n) => {
                        const cnt = respsP.filter((r) => r.respuesta === String(n)).length
                        const pct = respsP.length ? Math.round((cnt / respsP.length) * 100) : 0
                        return (
                          <div key={n} className={styles.escalaFila}>
                            <span className={styles.escalaLabel}>{n}</span>
                            <div className={styles.barraOuter}>
                              <div className={styles.barraInner} style={{ width: `${pct}%`, background: n >= 4 ? '#4ade80' : n === 3 ? 'var(--acento)' : '#f87171' }} />
                            </div>
                            <span className={styles.opcionCnt}>{cnt}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Texto libre: lista de respuestas */}
                {p.tipo === 'texto' && (
                  <ul className={styles.textosLista}>
                    {respsP.filter((r) => r.respuesta).map((r) => (
                      <li key={r.id} className={styles.textoItem}>
                        "{r.respuesta}"
                      </li>
                    ))}
                    {respsP.filter((r) => r.respuesta).length === 0 && (
                      <li className={styles.textoVacio}>Sin respuestas escritas.</li>
                    )}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
