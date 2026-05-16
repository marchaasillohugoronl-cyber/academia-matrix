'use client'
import { useTransition }     from 'react'
import Link                  from 'next/link'
import { ArrowLeft, Clock, Loader2, Send } from 'lucide-react'
import { entregarExamen }    from './actions'
import styles from '../../prueba.module.css'

const LETRAS = ['A', 'B', 'C', 'D']

type Pregunta = {
  id: string
  tipo: string
  enunciado: string
  opciones: string[] | null
  orden: number | null
}
type Examen = {
  id: string
  titulo: string
  descripcion: string | null
  duracionMinutos: number | null
}

export default function FormExamen({ examen, preguntas }: { examen: Examen; preguntas: Pregunta[] }) {
  const [pending, start] = useTransition()

  function handleSubmit(data: FormData) {
    if (!confirm(`¿Entregar el examen "${examen.titulo}"? No podrás modificar tus respuestas.`)) return
    start(async () => { await entregarExamen(examen.id, data) })
  }

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLogo}>
          <span className={styles.topbarMarca}>MATRIX</span>
          <span className={styles.topbarSub}>Portal del alumno</span>
        </div>
        <Link href="/portal/dashboard" className={styles.btnVolver}>
          <ArrowLeft size={13} /> Dashboard
        </Link>
      </header>

      <main className={styles.main}>
        {/* Cabecera del examen */}
        <div className={styles.cabecera}>
          <div className={styles.cabeceraTag}>
            <span className={styles.cabeceraTagPunto} />
            Examen activo
          </div>
          <h1 className={styles.cabeceraTitle}>{examen.titulo}</h1>
          {examen.descripcion && (
            <p className={styles.cabeceraDesc}>{examen.descripcion}</p>
          )}
          <div className={styles.cabeceraChips}>
            <span className={styles.chip}>{preguntas.length} preguntas</span>
            {examen.duracionMinutos && (
              <span className={`${styles.chip} ${styles.chipDestacado}`}>
                <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                {examen.duracionMinutos} min
              </span>
            )}
          </div>
        </div>

        {/* Formulario */}
        <form action={handleSubmit}>
          <ol className={styles.listaPreguntas}>
            {preguntas.map((p, i) => (
              <li key={p.id} className={styles.pregunta}>
                <div className={styles.preguntaHead}>
                  <span className={styles.preguntaNum}>{i + 1}</span>
                  <p className={styles.preguntaTexto}>{p.enunciado}</p>
                  <span className={styles.preguntaTipoTag}>
                    {p.tipo === 'multiple' ? 'Múltiple' : 'Libre'}
                  </span>
                </div>

                {p.tipo === 'multiple' && p.opciones ? (
                  <div className={styles.opciones}>
                    {p.opciones.map((op, idx) => op && (
                      <label key={idx} className={styles.opcionLabel}>
                        <input
                          type="radio"
                          name={`p_${p.id}`}
                          value={String(idx)}
                          className={styles.opcionRadio}
                        />
                        <span className={styles.opcionLetra}>{LETRAS[idx]}</span>
                        <span className={styles.opcionTexto}>{op}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className={styles.textareaWrap}>
                    <textarea
                      name={`p_${p.id}`}
                      placeholder="Escribe tu respuesta aquí…"
                      rows={3}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div className={styles.footer}>
            <span className={styles.footerMeta}>
              Revisa tus respuestas antes de enviar.
            </span>
            <button type="submit" disabled={pending} className={styles.btnEnviar}>
              {pending
                ? <><Loader2 size={14} style={{ animation: 'girar 0.8s linear infinite' }} /> Enviando…</>
                : <><Send size={14} /> Entregar examen</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
