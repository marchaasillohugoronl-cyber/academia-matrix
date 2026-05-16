'use client'
import { useState } from 'react'
import styles from '../admin.module.css'

export default function FormEditarConfig({ sitio }: { sitio: Record<string, string> }) {
  const [guardando, setGuardando] = useState(false)
  const [mensaje,   setMensaje]   = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)

    const f = new FormData(e.currentTarget)
    const payload: Record<string, string> = {}
    f.forEach((val, key) => { payload[key] = val as string })

    const res = await fetch('/api/configuracion', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    setMensaje(
      res.ok
        ? { tipo: 'ok',    texto: '✓ Configuración guardada correctamente' }
        : { tipo: 'error', texto: '✗ Error al guardar. Intenta de nuevo.' }
    )
    setGuardando(false)
  }

  const campo = (name: string, label: string, placeholder?: string) => (
    <div className={styles.campo}>
      <label className={styles.label}>{label}</label>
      <input
        name={name}
        defaultValue={sitio[name] ?? ''}
        className={styles.input}
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {campo('nombre',           'Nombre completo',         'Academia de Matemáticas MATRIX')}
      {campo('nombreCorto',      'Nombre corto',            'MATRIX')}

      <hr className={styles.divider} />

      {campo('telefono',         'Teléfono',                '922977802')}
      {campo('whatsapp',         'URL de WhatsApp',         'https://wa.me/51...')}

      <hr className={styles.divider} />

      {campo('ubicacion',        'Ubicación general',       'Cabanillas, Perú')}
      {campo('lugarInscripcion', 'Lugar de inscripciones',  'Plaza de Armas – Cabanillas')}
      {campo('lugarClases',      'Lugar de clases',         'Colegio Mixto de Cabanillas')}
      {campo('urlMapa',          'URL de Google Maps',      'https://maps.google.com/...')}

      <div className={styles.acciones}>
        <button type="submit" disabled={guardando} className={styles.btnGuardar}>
          {guardando ? 'Guardando...' : 'Guardar configuración'}
        </button>

        {mensaje && (
          <span className={mensaje.tipo === 'ok' ? styles.mensajeOk : styles.mensajeError}>
            {mensaje.texto}
          </span>
        )}
      </div>
    </form>
  )
}
