import { db }                       from '@/lib/db'
import { examenes, preguntasExamen } from '@/lib/db/schema'
import { eq, desc }                  from 'drizzle-orm'
import Link                          from 'next/link'
import { BookOpen, Plus, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react'
import { toggleExamen, eliminarExamen } from './actions'
import BtnEliminar from '../BtnEliminar'
import styles from './examenes.module.css'

export const dynamic = 'force-dynamic'

export default async function PaginaExamenes() {
  const lista = await db.select().from(examenes).orderBy(desc(examenes.creadoEn))

  const conPreguntas = await Promise.all(
    lista.map(async (e) => {
      const cant = await db.select({ id: preguntasExamen.id }).from(preguntasExamen).where(eq(preguntasExamen.examenId, e.id))
      return { ...e, totalPreguntas: cant.length }
    })
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}><BookOpen size={22} /></div>
          <div>
            <h1 className={styles.titulo}>Exámenes</h1>
            <p className={styles.sub}>{lista.length} exámenes · {lista.filter(e => e.activo).length} activos</p>
          </div>
        </div>
        <Link href="/admin/examenes/nuevo" className={styles.btnNuevo}>
          <Plus size={15} /> Nuevo examen
        </Link>
      </div>

      {conPreguntas.length === 0 ? (
        <div className={styles.vacio}><BookOpen size={40} strokeWidth={1} /><p>No hay exámenes todavía.</p></div>
      ) : (
        <ul className={styles.lista}>
          {conPreguntas.map((e) => (
            <li key={e.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <div className={styles.itemTop}>
                  <span className={e.activo ? styles.badgeActivo : styles.badgeInactivo}>
                    {e.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className={styles.itemMeta}>{e.totalPreguntas} preguntas · {e.duracionMinutos} min</span>
                </div>
                <p className={styles.itemTitulo}>{e.titulo}</p>
                {e.descripcion && <p className={styles.itemDesc}>{e.descripcion}</p>}
              </div>
              <div className={styles.itemAcciones}>
                <form action={toggleExamen.bind(null, e.id, !e.activo)}>
                  <button type="submit" title={e.activo ? 'Desactivar' : 'Activar'} className={styles.btnIcono}>
                    {e.activo ? <ToggleRight size={18} style={{ color: 'var(--acento)' }} /> : <ToggleLeft size={18} />}
                  </button>
                </form>
                <Link href={`/admin/examenes/${e.id}`} className={styles.btnIcono} title="Editar preguntas">
                  <ChevronRight size={16} />
                </Link>
                <BtnEliminar
                  action={eliminarExamen.bind(null, e.id)}
                  mensaje="¿Eliminar este examen y todas sus preguntas?"
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
