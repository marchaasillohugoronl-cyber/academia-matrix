'use client'
import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { ArrowLeft, Loader2 }      from 'lucide-react'
import { crearEncuesta }           from '../actions'
import styles from '../encuestas.module.css'

export default function NuevaEncuesta() {
  const navegar = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState('')

  function handleSubmit(data: FormData) {
    start(async () => {
      const res = await crearEncuesta(data)
      if ('error' in res) { setError(res.error ?? ''); return }
      if (res.ok) navegar.push(`/admin/encuestas/${res.id}`)
    })
  }

  return (
    <div className={styles.page}>
      <button className={styles.btnVolver} onClick={() => navegar.push('/admin/encuestas')}>
        <ArrowLeft size={14} /> Volver
      </button>
      <div className={styles.formCard}>
        <div className={styles.formCardHead}>Nueva encuesta</div>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <form action={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label>Título</label>
            <input name="titulo" type="text" placeholder="Ej: Encuesta de satisfacción — Ciclo Sabatino" required />
          </div>
          <div className={styles.campo}>
            <label>Descripción (opcional)</label>
            <textarea name="descripcion" rows={3} placeholder="Breve descripción de la encuesta…" />
          </div>
          <button type="submit" disabled={pending} className={styles.btnSubmit}>
            {pending ? <><Loader2 size={14} className={styles.spin} /> Creando…</> : 'Crear y agregar preguntas →'}
          </button>
        </form>
      </div>
    </div>
  )
}
