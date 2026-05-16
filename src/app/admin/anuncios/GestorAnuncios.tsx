'use client'
import { useState, useTransition } from 'react'
import { Megaphone, Plus, Trash2, Eye, EyeOff, X, Loader2 } from 'lucide-react'
import { crearAnuncio, togglePublicado, eliminarAnuncio } from './actions'
import styles from './anuncios.module.css'

type Anuncio = { id: string; titulo: string; contenido: string; publicado: boolean | null; creadoEn: Date | null }

function formatFecha(d: Date | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function GestorAnuncios({ lista }: { lista: Anuncio[] }) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [pending, start] = useTransition()
  const [error, setError] = useState('')

  async function handleCrear(data: FormData) {
    start(async () => {
      const res = await crearAnuncio(data)
      if ('error' in res) { setError(res.error ?? ''); return }
      setMostrarForm(false)
      setError('')
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}><Megaphone size={22} /></div>
          <div>
            <h1 className={styles.titulo}>Anuncios</h1>
            <p className={styles.sub}>{lista.length} anuncios · {lista.filter(a => a.publicado).length} publicados</p>
          </div>
        </div>
        <button className={styles.btnNuevo} onClick={() => { setMostrarForm(true); setError('') }}>
          <Plus size={15} /> Nuevo anuncio
        </button>
      </div>

      {/* Formulario nuevo */}
      {mostrarForm && (
        <div className={styles.formCard}>
          <div className={styles.formCardHead}>
            <span>Nuevo anuncio</span>
            <button className={styles.btnCerrar} onClick={() => setMostrarForm(false)}><X size={16} /></button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <form action={handleCrear} className={styles.form}>
            <div className={styles.campo}>
              <label>Título</label>
              <input name="titulo" type="text" placeholder="Ej: Inicio de clases — Ciclo Sabatino" required />
            </div>
            <div className={styles.campo}>
              <label>Contenido</label>
              <textarea name="contenido" rows={4} placeholder="Escribe el mensaje completo…" required />
            </div>
            <label className={styles.checkLabel}>
              <input name="publicado" type="checkbox" defaultChecked />
              <span>Publicar inmediatamente</span>
            </label>
            <button type="submit" disabled={pending} className={styles.btnSubmit}>
              {pending ? <><Loader2 size={14} className={styles.spin} /> Guardando…</> : 'Guardar anuncio'}
            </button>
          </form>
        </div>
      )}

      {/* Lista */}
      {lista.length === 0 ? (
        <div className={styles.vacio}><Megaphone size={40} strokeWidth={1} /><p>No hay anuncios todavía.</p></div>
      ) : (
        <ul className={styles.lista}>
          {lista.map((a) => (
            <li key={a.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <div className={styles.itemTop}>
                  <span className={a.publicado ? styles.badgePublicado : styles.badgeBorrador}>
                    {a.publicado ? 'Publicado' : 'Borrador'}
                  </span>
                  <span className={styles.itemFecha}>{formatFecha(a.creadoEn)}</span>
                </div>
                <p className={styles.itemTitulo}>{a.titulo}</p>
                <p className={styles.itemContenido}>{a.contenido}</p>
              </div>
              <div className={styles.itemAcciones}>
                <button
                  title={a.publicado ? 'Despublicar' : 'Publicar'}
                  className={styles.btnIcono}
                  onClick={() => togglePublicado(a.id, !a.publicado)}
                >
                  {a.publicado ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  title="Eliminar"
                  className={`${styles.btnIcono} ${styles.btnEliminar}`}
                  onClick={() => { if (confirm('¿Eliminar este anuncio?')) eliminarAnuncio(a.id) }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
