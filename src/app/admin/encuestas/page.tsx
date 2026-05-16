import { db }                          from '@/lib/db'
import { encuestas, preguntasEncuesta } from '@/lib/db/schema'
import { eq, desc }                     from 'drizzle-orm'
import Link                             from 'next/link'
import { ClipboardList, Plus, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react'
import { toggleEncuesta, eliminarEncuesta } from './actions'
import BtnEliminar from '../BtnEliminar'
import styles from './encuestas.module.css'

export const dynamic = 'force-dynamic'

export default async function PaginaEncuestas() {
  const lista = await db.select().from(encuestas).orderBy(desc(encuestas.creadaEn))

  const conPreguntas = await Promise.all(
    lista.map(async (e) => {
      const cant = await db.select({ id: preguntasEncuesta.id }).from(preguntasEncuesta).where(eq(preguntasEncuesta.encuestaId, e.id))
      return { ...e, totalPreguntas: cant.length }
    })
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}><ClipboardList size={22} /></div>
          <div>
            <h1 className={styles.titulo}>Encuestas</h1>
            <p className={styles.sub}>{lista.length} encuestas · {lista.filter(e => e.activa).length} activas</p>
          </div>
        </div>
        <Link href="/admin/encuestas/nuevo" className={styles.btnNuevo}>
          <Plus size={15} /> Nueva encuesta
        </Link>
      </div>

      {conPreguntas.length === 0 ? (
        <div className={styles.vacio}><ClipboardList size={40} strokeWidth={1} /><p>No hay encuestas todavía.</p></div>
      ) : (
        <ul className={styles.lista}>
          {conPreguntas.map((e) => (
            <li key={e.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <div className={styles.itemTop}>
                  <span className={e.activa ? styles.badgeActiva : styles.badgeInactiva}>
                    {e.activa ? 'Activa' : 'Inactiva'}
                  </span>
                  <span className={styles.itemMeta}>{e.totalPreguntas} preguntas</span>
                </div>
                <p className={styles.itemTitulo}>{e.titulo}</p>
                {e.descripcion && <p className={styles.itemDesc}>{e.descripcion}</p>}
              </div>
              <div className={styles.itemAcciones}>
                <form action={toggleEncuesta.bind(null, e.id, !e.activa)}>
                  <button type="submit" title={e.activa ? 'Desactivar' : 'Activar'} className={styles.btnIcono}>
                    {e.activa ? <ToggleRight size={18} style={{ color: 'var(--acento)' }} /> : <ToggleLeft size={18} />}
                  </button>
                </form>
                <Link href={`/admin/encuestas/${e.id}`} className={styles.btnIcono} title="Editar preguntas">
                  <ChevronRight size={16} />
                </Link>
                <BtnEliminar
                  action={eliminarEncuesta.bind(null, e.id)}
                  mensaje="¿Eliminar esta encuesta y todas sus preguntas?"
                  className={`${styles.btnIcono} ${styles.btnEliminar}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
