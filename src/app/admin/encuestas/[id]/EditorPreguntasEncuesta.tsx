'use client'
import { useState, useTransition } from 'react'
import Link                         from 'next/link'
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react'
import { agregarPreguntaEncuesta, eliminarPreguntaEncuesta } from '../actions'
import styles from '../encuestas.module.css'

type Encuesta = { id: string; titulo: string; descripcion: string | null; activa: boolean | null }
type Pregunta = { id: string; texto: string; tipo: string; opciones: string[] | null }

const TIPOS = [
  { val: 'multiple', label: 'Opción múltiple' },
  { val: 'texto',    label: 'Respuesta libre'  },
  { val: 'escala',   label: 'Escala 1–5'       },
]
const LETRAS = ['A', 'B', 'C', 'D']

export default function EditorPreguntasEncuesta({ encuesta, preguntas }: { encuesta: Encuesta; preguntas: Pregunta[] }) {
  const [tipo, setTipo]        = useState('multiple')
  const [mostrarForm, setForm] = useState(false)
  const [error, setError]      = useState('')
  const [pending, start]       = useTransition()

  function handleAgregar(data: FormData) {
    data.set('tipo', tipo)
    start(async () => {
      const res = await agregarPreguntaEncuesta(encuesta.id, data)
      if (res && 'error' in res) { setError(res.error ?? ''); return }
      setError(''); setForm(false)
    })
  }

  return (
    <div className={styles.page}>
      <Link href="/admin/encuestas" className={styles.btnVolver}>
        <ArrowLeft size={14} /> Encuestas
      </Link>

      <div className={styles.examenHeader}>
        <div>
          <h1 className={styles.titulo}>{encuesta.titulo}</h1>
          {encuesta.descripcion && <p className={styles.sub}>{encuesta.descripcion}</p>}
          <p className={styles.sub}>{preguntas.length} preguntas · {encuesta.activa ? '✓ Activa' : 'Inactiva'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href={`/admin/encuestas/${encuesta.id}/resultados`} className={styles.btnNuevo}
            style={{ background: 'transparent', color: 'var(--acento)', border: '1px solid rgba(0,200,240,0.35)' }}>
            Ver resultados
          </a>
          <button className={styles.btnNuevo} onClick={() => { setForm(true); setError('') }}>
            <Plus size={15} /> Agregar pregunta
          </button>
        </div>
      </div>

      {mostrarForm && (
        <div className={styles.formCard} style={{ marginBottom: 24 }}>
          <div className={styles.formCardHead}>
            <span>Nueva pregunta</span>
            <button className={styles.btnCerrar} onClick={() => setForm(false)}>✕</button>
          </div>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <form action={handleAgregar} className={styles.form}>
            <div className={styles.tipoSelector}>
              {TIPOS.map((t) => (
                <button key={t.val} type="button"
                  className={`${styles.tipobtn} ${tipo === t.val ? styles.tipoActivo : ''}`}
                  onClick={() => setTipo(t.val)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className={styles.campo}>
              <label>Enunciado</label>
              <textarea name="enunciado" rows={2} placeholder="Escribe la pregunta…" required />
            </div>
            {tipo === 'multiple' && (
              <div className={styles.opcionesGrid}>
                {LETRAS.map((l) => (
                  <label key={l} className={styles.opcionLabel}>
                    <span className={styles.opcionLetra}>{l}</span>
                    <input name={`opcion${l}`} type="text" placeholder={`Opción ${l}`} />
                  </label>
                ))}
              </div>
            )}
            {tipo === 'escala' && (
              <p className={styles.ayudaCorrecta}>Los alumnos responderán con un valor del 1 al 5.</p>
            )}
            <button type="submit" disabled={pending} className={styles.btnSubmit}>
              {pending ? <><Loader2 size={14} className={styles.spin} /> Guardando…</> : 'Guardar pregunta'}
            </button>
          </form>
        </div>
      )}

      {preguntas.length === 0 ? (
        <div className={styles.vacio}><p>No hay preguntas. Agrega la primera.</p></div>
      ) : (
        <ol className={styles.listaPreguntas}>
          {preguntas.map((p, i) => (
            <li key={p.id} className={styles.preguntaItem}>
              <div className={styles.preguntaNum}>{i + 1}</div>
              <div className={styles.preguntaInfo}>
                <p className={styles.preguntaEnunciado}>{p.texto}</p>
                {p.tipo === 'multiple' && p.opciones && (
                  <ul className={styles.opcionesList}>
                    {p.opciones.map((op, idx) => op && (
                      <li key={idx} className={styles.opcionItem}>
                        <span className={styles.opcionBadge}>{LETRAS[idx]}</span>{op}
                      </li>
                    ))}
                  </ul>
                )}
                <span className={styles.preguntaMeta}>
                  {p.tipo === 'multiple' ? 'Múltiple' : p.tipo === 'escala' ? 'Escala 1–5' : 'Libre'}
                </span>
              </div>
              <form action={eliminarPreguntaEncuesta.bind(null, p.id, encuesta.id)}>
                <button type="submit" className={`${styles.btnIcono} ${styles.btnEliminar}`}
                  onClick={(e) => { if (!confirm('¿Eliminar?')) e.preventDefault() }}>
                  <Trash2 size={15} />
                </button>
              </form>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
