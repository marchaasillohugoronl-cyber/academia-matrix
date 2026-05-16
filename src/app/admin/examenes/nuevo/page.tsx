'use client'
import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { ArrowLeft, Loader2 }      from 'lucide-react'
import { crearExamen }             from '../actions'
import styles from '../examenes.module.css'

export default function NuevoExamen() {
  const navegar = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState('')

  function handleSubmit(data: FormData) {
    start(async () => {
      const res = await crearExamen(data)
      if ('error' in res) { setError(res.error ?? ''); return }
      if (res.ok) navegar.push(`/admin/examenes/${res.id}`)
    })
  }

  return (
    <div className={styles.page}>
      <button className={styles.btnVolver} onClick={() => navegar.push('/admin/examenes')}>
        <ArrowLeft size={14} /> Volver
      </button>

      <div className={styles.formCard}>
        <div className={styles.formCardHead}>Nuevo examen</div>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <form action={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label>Título del examen</label>
            <input name="titulo" type="text" placeholder="Ej: Examen de Álgebra — Nivel Secundaria" required />
          </div>
          <div className={styles.campo}>
            <label>Descripción (opcional)</label>
            <textarea name="descripcion" rows={3} placeholder="Instrucciones o descripción breve…" />
          </div>
          <div className={styles.campo} style={{ maxWidth: 200 }}>
            <label>Duración (minutos)</label>
            <input name="duracionMinutos" type="number" min={5} max={180} defaultValue={45} />
          </div>
          <button type="submit" disabled={pending} className={styles.btnSubmit}>
            {pending ? <><Loader2 size={14} className={styles.spin} /> Creando…</> : 'Crear y agregar preguntas →'}
          </button>
        </form>
      </div>
    </div>
  )
}
