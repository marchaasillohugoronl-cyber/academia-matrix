'use client'
import { useTransition }      from 'react'
import Link                   from 'next/link'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { responderEncuesta }  from './actions'
import styles from '../../prueba.module.css'

const LETRAS = ['A', 'B', 'C', 'D']

type Pregunta = {
  id: string
  tipo: string
  texto: string
  opciones: string[] | null
  orden: number | null
}
type Encuesta = {
  id: string
  titulo: string
  descripcion: string | null
}

export default function FormEncuesta({ encuesta, preguntas }: { encuesta: Encuesta; preguntas: Pregunta[] }) {
  const [pending, start] = useTransition()

  function handleSubmit(data: FormData) {
    start(async () => { await responderEncuesta(encuesta.id, data) })
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
        {/* Cabecera */}
        <div className={styles.cabecera}>
          <div className={styles.cabeceraTag}>
            <span className={styles.cabeceraTagPunto} />
            Encuesta activa
          </div>
          <h1 className={styles.cabeceraTitle}>{encuesta.titulo}</h1>
          {encuesta.descripcion && (
            <p className={styles.cabeceraDesc}>{encuesta.descripcion}</p>
          )}
          <div className={styles.cabeceraChips}>
            <span className={styles.chip}>{preguntas.length} preguntas</span>
            <span className={styles.chip}>Anónima · tus datos son privados</span>
          </div>
        </div>

        {/* Formulario */}
        <form action={handleSubmit}>
          <ol className={styles.listaPreguntas}>
            {preguntas.map((p, i) => (
              <li key={p.id} className={styles.pregunta}>
                <div className={styles.preguntaHead}>
                  <span className={styles.preguntaNum}>{i + 1}</span>
                  <p className={styles.preguntaTexto}>{p.texto}</p>
                  <span className={styles.preguntaTipoTag}>
                    {p.tipo === 'multiple' ? 'Opción' : p.tipo === 'escala' ? 'Escala' : 'Libre'}
                  </span>
                </div>

                {p.tipo === 'multiple' && p.opciones ? (
                  <div className={styles.opciones}>
                    {p.opciones.map((op, idx) => op && (
                      <label key={idx} className={styles.opcionLabel}>
                        <input
                          type="radio"
                          name={`p_${p.id}`}
                          value={op}
                          className={styles.opcionRadio}
                        />
                        <span className={styles.opcionLetra}>{LETRAS[idx]}</span>
                        <span className={styles.opcionTexto}>{op}</span>
                      </label>
                    ))}
                  </div>
                ) : p.tipo === 'escala' ? (
                  <div className={styles.escala}>
                    <div className={styles.escalaBotones}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <label key={n} className={styles.escalaBtnLabel}>
                          <input
                            type="radio"
                            name={`p_${p.id}`}
                            value={String(n)}
                            className={styles.escalaRadio}
                          />
                          <span className={styles.escalaBtn}>{n}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.escalaLabel}>
                      <span className={styles.escalaLabelTexto}>Muy malo</span>
                      <span className={styles.escalaLabelTexto}>Excelente</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.textareaWrap}>
                    <textarea
                      name={`p_${p.id}`}
                      placeholder="Escribe tu respuesta aquí… (opcional)"
                      rows={3}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div className={styles.footer}>
            <span className={styles.footerMeta}>
              Tus respuestas son confidenciales.
            </span>
            <button type="submit" disabled={pending} className={styles.btnEnviar}>
              {pending
                ? <><Loader2 size={14} style={{ animation: 'girar 0.8s linear infinite' }} /> Enviando…</>
                : <><Send size={14} /> Enviar encuesta</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
