'use client'
import { useState, useTransition } from 'react'
import Link                         from 'next/link'
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react'
import { agregarPregunta, eliminarPregunta } from '../actions'
import styles from '../examenes.module.css'

type Examen   = { id: string; titulo: string; descripcion: string | null; duracionMinutos: number | null; activo: boolean | null }
type Pregunta = { id: string; enunciado: string; tipo: string; opciones: string[] | null; respuestaCorrecta: string | null; puntaje: number | null }

const LETRAS = ['A', 'B', 'C', 'D']

export default function EditorPreguntas({ examen, preguntas }: { examen: Examen; preguntas: Pregunta[] }) {
  const [tipo, setTipo]        = useState<'multiple' | 'texto'>('multiple')
  const [correcta, setCorrecta] = useState('0')
  const [mostrarForm, setForm] = useState(false)
  const [error, setError]      = useState('')
  const [pending, start]       = useTransition()

  function handleAgregar(data: FormData) {
    data.set('tipo', tipo)
    data.set('correcta', correcta)
    start(async () => {
      const res = await agregarPregunta(examen.id, data)
      if (res && 'error' in res) { setError(res.error ?? ''); return }
      setError(''); setForm(false)
    })
  }

  return (
    <div className={styles.page}>
      <Link href="/admin/examenes" className={styles.btnVolver}>
        <ArrowLeft size={14} /> Exámenes
      </Link>

      <div className={styles.examenHeader}>
        <div>
          <h1 className={styles.titulo}>{examen.titulo}</h1>
          {examen.descripcion && <p className={styles.sub}>{examen.descripcion}</p>}
          <p className={styles.sub}>{preguntas.length} preguntas · {examen.duracionMinutos} min · {examen.activo ? '✓ Activo' : 'Inactivo'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href={`/admin/examenes/${examen.id}/resultados`} className={styles.btnNuevo}
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
              {(['multiple', 'texto'] as const).map((t) => (
                <button key={t} type="button"
                  className={`${styles.tipobtn} ${tipo === t ? styles.tipoActivo : ''}`}
                  onClick={() => setTipo(t)}>
                  {t === 'multiple' ? 'Opción múltiple' : 'Respuesta libre'}
                </button>
              ))}
            </div>

            <div className={styles.campo}>
              <label>Enunciado</label>
              <textarea name="enunciado" rows={3} placeholder="Escribe la pregunta…" required />
            </div>

            {tipo === 'multiple' && (
              <div className={styles.opcionesGrid}>
                {LETRAS.map((l, i) => (
                  <label key={l} className={`${styles.opcionLabel} ${correcta === String(i) ? styles.opcionCorrecta : ''}`}
                    onClick={() => setCorrecta(String(i))}>
                    <span className={styles.opcionRadio}>
                      {correcta === String(i)
                        ? <span style={{ color: 'var(--acento)', fontSize: '1rem' }}>●</span>
                        : <span style={{ color: 'var(--atenuado)', fontSize: '1rem' }}>○</span>}
                    </span>
                    <span className={styles.opcionLetra}>{l}</span>
                    <input name={`opcion${l}`} type="text" placeholder={`Opción ${l}`}
                      onClick={(e) => e.stopPropagation()} />
                  </label>
                ))}
                <p className={styles.ayudaCorrecta}>Haz clic en la fila de la respuesta correcta</p>
              </div>
            )}

            <div className={styles.campo} style={{ maxWidth: 160 }}>
              <label>Puntaje</label>
              <input name="puntaje" type="number" min={1} defaultValue={1} />
            </div>

            <button type="submit" disabled={pending} className={styles.btnSubmit}>
              {pending ? <><Loader2 size={14} className={styles.spin} /> Guardando…</> : 'Guardar pregunta'}
            </button>
          </form>
        </div>
      )}

      {preguntas.length === 0 ? (
        <div className={styles.vacio}><p>No hay preguntas aún. Agrega la primera.</p></div>
      ) : (
        <ol className={styles.listaPreguntas}>
          {preguntas.map((p, i) => (
            <li key={p.id} className={styles.preguntaItem}>
              <div className={styles.preguntaNum}>{i + 1}</div>
              <div className={styles.preguntaInfo}>
                <p className={styles.preguntaEnunciado}>{p.enunciado}</p>
                {p.tipo === 'multiple' && p.opciones && (
                  <ul className={styles.opcionesList}>
                    {p.opciones.map((op, idx) => op && (
                      <li key={idx} className={`${styles.opcionItem} ${p.respuestaCorrecta === String(idx) ? styles.opcionItemCorrecta : ''}`}>
                        <span className={styles.opcionBadge}>{LETRAS[idx]}</span>{op}
                      </li>
                    ))}
                  </ul>
                )}
                <span className={styles.preguntaMeta}>{p.tipo === 'multiple' ? 'Múltiple' : 'Libre'} · {p.puntaje} pt</span>
              </div>
              <form action={eliminarPregunta.bind(null, p.id, examen.id)}>
                <button type="submit" className={`${styles.btnIcono} ${styles.btnEliminar}`}
                  onClick={(e) => { if (!confirm('¿Eliminar esta pregunta?')) e.preventDefault() }}>
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
