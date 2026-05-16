import { db }                                          from '@/lib/db'
import { entregasExamen, preguntasExamen, examenes }  from '@/lib/db/schema'
import { eq }                                         from 'drizzle-orm'
import { notFound, redirect }                         from 'next/navigation'
import Link                                           from 'next/link'
import { getAlumnoSesion }                            from '@/lib/portal-session'
import { ArrowLeft, CheckCircle2, XCircle, Minus }   from 'lucide-react'
import styles from '../../../prueba.module.css'
import res from './resultado.module.css'

export const dynamic = 'force-dynamic'

const LETRAS = ['A', 'B', 'C', 'D']

export default async function ResultadoAlumno({ params }: { params: Promise<{ entregaId: string }> }) {
  const { entregaId } = await params

  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')

  const [entrega] = await db
    .select()
    .from(entregasExamen)
    .where(eq(entregasExamen.id, entregaId))
    .limit(1)

  if (!entrega || entrega.alumnoId !== alumno.id) notFound()

  const [examen] = await db
    .select()
    .from(examenes)
    .where(eq(examenes.id, entrega.examenId!))
    .limit(1)

  const preguntas = await db
    .select()
    .from(preguntasExamen)
    .where(eq(preguntasExamen.examenId, entrega.examenId!))
    .orderBy(preguntasExamen.orden)

  const respuestas = (entrega.respuestas ?? {}) as Record<string, string>
  const puntajeTotal = preguntas.reduce((s, p) => s + (p.puntaje ?? 1), 0)
  const score = entrega.puntajeAuto ?? 0
  const pct   = puntajeTotal ? Math.round((score / puntajeTotal) * 100) : 0
  const aprobado = pct >= 60

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLogo}>
          <span className={styles.topbarMarca}>MATRIX</span>
          <span className={styles.topbarSub}>Resultado del examen</span>
        </div>
        <Link href="/portal/dashboard" className={styles.btnVolver}>
          <ArrowLeft size={13} /> Dashboard
        </Link>
      </header>

      <main className={styles.main}>
        {/* Score banner */}
        <div className={`${res.scoreBanner} ${aprobado ? res.scoreBannerOk : res.scoreBannerMal}`}>
          <div className={res.scoreIcono}>
            {aprobado
              ? <CheckCircle2 size={32} />
              : <XCircle size={32} />}
          </div>
          <div className={res.scoreInfo}>
            <p className={res.scoreTitulo}>{aprobado ? '¡Aprobado!' : 'No aprobado'}</p>
            <p className={res.scoreExamen}>{examen?.titulo}</p>
          </div>
          <div className={res.scorePts}>
            <span className={res.scoreNum}>{score}</span>
            <span className={res.scoreTotal}>/ {puntajeTotal} pts</span>
            <span className={aprobado ? res.scorePct : res.scorePctMal}>{pct}%</span>
          </div>
        </div>

        {/* Preguntas corregidas */}
        <ol className={styles.listaPreguntas}>
          {preguntas.map((p, i) => {
            const respAlumno = respuestas[p.id]
            const esCorrecta = p.tipo === 'multiple'
              ? respAlumno === p.respuestaCorrecta
              : null

            return (
              <li key={p.id} className={styles.pregunta}>
                <div className={styles.preguntaHead}>
                  <span className={styles.preguntaNum}>{i + 1}</span>
                  <p className={styles.preguntaTexto}>{p.enunciado}</p>
                  <span className={styles.preguntaTipoTag}>
                    {esCorrecta === true  ? <CheckCircle2 size={14} style={{ color: '#4ade80' }} /> :
                     esCorrecta === false ? <XCircle      size={14} style={{ color: '#f87171' }} /> :
                                           <Minus         size={14} style={{ color: 'var(--atenuado)' }} />}
                  </span>
                </div>

                {p.tipo === 'multiple' && p.opciones && (
                  <div className={styles.opciones}>
                    {p.opciones.map((op, idx) => {
                      if (!op) return null
                      const opIdx    = String(idx)
                      const correcta = opIdx === p.respuestaCorrecta
                      const elegida  = opIdx === respAlumno
                      return (
                        <div key={idx} className={`${styles.opcionLabel}
                          ${correcta        ? res.opCorrect : ''}
                          ${elegida && !correcta ? res.opWrong : ''}
                        `}>
                          <span className={styles.opcionLetra}>{LETRAS[idx]}</span>
                          <span className={styles.opcionTexto}>{op}</span>
                          {correcta && <CheckCircle2 size={13} style={{ color: '#4ade80', flexShrink: 0 }} />}
                          {elegida && !correcta && <XCircle size={13} style={{ color: '#f87171', flexShrink: 0 }} />}
                        </div>
                      )
                    })}
                  </div>
                )}

                {p.tipo === 'texto' && (
                  <div className={res.textoCont}>
                    <p className={res.textoLabel}>Tu respuesta:</p>
                    <p className={res.textoVal}>{respAlumno || <em>Sin respuesta</em>}</p>
                    {p.respuestaCorrecta && (
                      <>
                        <p className={res.textoLabel} style={{ marginTop: 8 }}>Respuesta esperada:</p>
                        <p className={res.textoCorrecta}>{p.respuestaCorrecta}</p>
                      </>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        <div className={styles.footer}>
          <span className={styles.footerMeta}>
            Revisa cada pregunta para identificar tus errores.
          </span>
          <Link href="/portal/dashboard" className={styles.okLink}>
            <ArrowLeft size={13} /> Volver al dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
