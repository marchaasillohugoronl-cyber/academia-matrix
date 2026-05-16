import { db }            from '@/lib/db'
import { configuracion } from '@/lib/db/schema'
import { configToObject } from '@/lib/sitio-util'
import Link               from 'next/link'
import FormEditarConfig   from './FormEditarConfig'
import styles from '../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminConfiguracion() {
  const rows  = await db.select().from(configuracion)
  const sitio = configToObject(rows)

  return (
    <div className={styles.container}>
      <Link href="/admin" className={styles.btnVolver}>← Dashboard</Link>

      <h1 className={styles.pageTitle} style={{ marginTop: 20 }}>Configuración del sitio</h1>
      <p className={styles.pageSubtitle}>
        Actualiza los datos de contacto y ubicación que aparecen en toda la web.
      </p>

      <FormEditarConfig sitio={sitio} />
    </div>
  )
}
