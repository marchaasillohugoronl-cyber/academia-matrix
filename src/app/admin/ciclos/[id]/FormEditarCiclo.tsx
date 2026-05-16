'use client'
import { useState }    from 'react'
import type { Ciclo }  from '@/lib/db/schema'
import styles from '../../admin.module.css'

export default function FormEditarCiclo({ ciclo }: { ciclo: Ciclo }) {
  const [guardando, setGuardando] = useState(false)
  const [mensaje,   setMensaje]   = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)

    const f = new FormData(e.currentTarget)

    const payload = {
      nombre:           f.get('nombre'),
      etiqueta:         f.get('etiqueta'),
      descripcion:      f.get('descripcion'),
      precio:           parseInt(f.get('precio') as string) || 0,
      etiquetaPrecio:   f.get('etiquetaPrecio'),
      subPrecio:        f.get('subPrecio'),
      duracion:         f.get('duracion'),
      totalHoras:       f.get('totalHoras'),
      inicioInscripcion: f.get('inicioInscripcion'),
      finInscripcion:   f.get('finInscripcion'),
      inicioClases:     f.get('inicioClases'),
      // turnos: coma-separado → array
      turnos:           (f.get('turnos') as string)
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean) || null,
      // estadisticas: JSON manual
      estadisticas:     (() => {
        try { return JSON.parse(f.get('estadisticas') as string) }
        catch { return ciclo.estadisticas }
      })(),
      activo: f.get('activo') === 'on',
    }

    const res = await fetch(`/api/ciclos/${ciclo.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (res.ok) {
      setMensaje({ tipo: 'ok', texto: '✓ Guardado correctamente' })
    } else {
      setMensaje({ tipo: 'error', texto: '✗ Error al guardar. Verifica los datos.' })
    }
    setGuardando(false)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* Fila 1: nombre + etiqueta */}
      <div className={styles.fila2}>
        <div className={styles.campo}>
          <label className={styles.label}>Nombre del ciclo</label>
          <input name="nombre" defaultValue={ciclo.nombre ?? ''} required className={styles.input} />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Etiqueta <span className={styles.labelHint}>(badge de estado)</span></label>
          <input name="etiqueta" defaultValue={ciclo.etiqueta ?? ''} className={styles.input} placeholder="INSCRIPCIONES ABIERTAS" />
        </div>
      </div>

      {/* Descripción */}
      <div className={styles.campo}>
        <label className={styles.label}>Descripción</label>
        <textarea name="descripcion" defaultValue={ciclo.descripcion ?? ''} className={styles.textarea} />
      </div>

      <hr className={styles.divider} />

      {/* Precios */}
      <div className={styles.fila2}>
        <div className={styles.campo}>
          <label className={styles.label}>Precio <span className={styles.labelHint}>(número entero)</span></label>
          <input name="precio" type="number" defaultValue={ciclo.precio ?? 0} className={styles.input} />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Etiqueta precio <span className={styles.labelHint}>(ej: S/ 47)</span></label>
          <input name="etiquetaPrecio" defaultValue={ciclo.etiquetaPrecio ?? ''} className={styles.input} />
        </div>
      </div>

      <div className={styles.fila2}>
        <div className={styles.campo}>
          <label className={styles.label}>Sub-precio <span className={styles.labelHint}>(ej: mensual)</span></label>
          <input name="subPrecio" defaultValue={ciclo.subPrecio ?? ''} className={styles.input} />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Duración <span className={styles.labelHint}>(ej: 4 semanas)</span></label>
          <input name="duracion" defaultValue={ciclo.duracion ?? ''} className={styles.input} />
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Total horas <span className={styles.labelHint}>(ej: 16 horas)</span></label>
        <input name="totalHoras" defaultValue={ciclo.totalHoras ?? ''} className={styles.input} />
      </div>

      <hr className={styles.divider} />

      {/* Fechas */}
      <div className={styles.fila2}>
        <div className={styles.campo}>
          <label className={styles.label}>Inicio inscripciones</label>
          <input name="inicioInscripcion" defaultValue={ciclo.inicioInscripcion ?? ''} className={styles.input} placeholder="Jueves 14 de mayo" />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Fin inscripciones</label>
          <input name="finInscripcion" defaultValue={ciclo.finInscripcion ?? ''} className={styles.input} placeholder="Viernes 22 de mayo" />
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Inicio de clases</label>
        <input name="inicioClases" defaultValue={ciclo.inicioClases ?? ''} className={styles.input} placeholder="23 de mayo" />
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Turnos <span className={styles.labelHint}>(separados por coma: Mañana, Tarde)</span></label>
        <input name="turnos" defaultValue={(ciclo.turnos ?? []).join(', ')} className={styles.input} placeholder="Mañana, Tarde" />
      </div>

      <hr className={styles.divider} />

      {/* Estadísticas (JSON) */}
      <div className={styles.campo}>
        <label className={styles.label}>
          Estadísticas <span className={styles.labelHint}>(JSON — array de {`{numero, etiqueta}`})</span>
        </label>
        <textarea
          name="estadisticas"
          defaultValue={JSON.stringify(ciclo.estadisticas ?? [], null, 2)}
          className={styles.textarea}
          style={{ minHeight: 120, fontFamily: 'monospace', fontSize: '0.8rem' }}
        />
      </div>

      {/* Activo */}
      <div className={styles.checkboxRow}>
        <input
          id="activo"
          name="activo"
          type="checkbox"
          defaultChecked={ciclo.activo ?? true}
          className={styles.checkbox}
        />
        <label htmlFor="activo" className={styles.label} style={{ marginBottom: 0 }}>
          Ciclo activo (visible en la web)
        </label>
      </div>

      {/* Botones */}
      <div className={styles.acciones}>
        <button type="submit" disabled={guardando} className={styles.btnGuardar}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
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
