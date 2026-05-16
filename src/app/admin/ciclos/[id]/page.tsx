import { db }     from '@/lib/db'
import { ciclos } from '@/lib/db/schema'
import { eq }     from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link         from 'next/link'
import FormEditarCiclo from './FormEditarCiclo'
import styles from '../../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function EditarCicloPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }  = await params
  const [ciclo] = await db.select().from(ciclos).where(eq(ciclos.id, id))
  if (!ciclo) notFound()

  return (
    <div className={styles.container}>
      <Link href="/admin/ciclos" className={styles.btnVolver}>← Ciclos</Link>

      <h1 className={styles.pageTitle} style={{ marginTop: 20 }}>
        {ciclo.emoji} {ciclo.nombre}
      </h1>
      <p className={styles.pageSubtitle}>
        Edita fechas, precios, turnos y descripción del ciclo.
      </p>

      <FormEditarCiclo ciclo={ciclo} />
    </div>
  )
}
