import Link        from 'next/link'
import { db }      from '@/lib/db'
import { ciclos }  from '@/lib/db/schema'
import { ChevronRight } from 'lucide-react'
import styles from '../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminCiclos() {
  const data = await db.select().from(ciclos)

  return (
    <div className={styles.container}>
      <Link href="/admin" className={styles.btnVolver}>
        ← Dashboard
      </Link>

      <h1 className={styles.pageTitle} style={{ marginTop: 20 }}>Ciclos académicos</h1>
      <p className={styles.pageSubtitle}>
        Selecciona un ciclo para editar fechas, precios, turnos y descripción.
      </p>

      <div className={styles.ciclosList}>
        {data.map((c) => (
          <Link key={c.id} href={`/admin/ciclos/${c.id}`} className={styles.cicloItem}>
            <div className={styles.cicloMeta}>
              <span className={styles.cicloNombre}>{c.nombre}</span>
              <span className={styles.cicloFecha}>
                Inicio de clases: {c.inicioClases ?? '—'} &nbsp;·&nbsp; Precio: {c.etiquetaPrecio ?? '—'} {c.subPrecio ?? ''}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={c.activo ? styles.badgeActivo : styles.badgeInactivo}>
                {c.activo ? 'Activo' : 'Inactivo'}
              </span>
              <ChevronRight size={14} style={{ color: 'var(--atenuado)', flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
