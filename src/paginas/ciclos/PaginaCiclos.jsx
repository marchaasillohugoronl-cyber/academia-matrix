'use client'
import { useRouter }   from 'next/navigation'
import { useAparecer } from '../../componentes/useAparecer'
import { CalendarDays, Sun, CalendarRange, ArrowRight } from 'lucide-react'
import styles from './PaginaCiclos.module.css'

const ICONOS_CICLO = {
  sabatino: CalendarDays,
  verano:   Sun,
  anual:    CalendarRange,
}

function TarjetaCiclo({ ciclo, retraso }) {
  const navegar = useRouter()
  const { ref, visible } = useAparecer()
  const Icono = ICONOS_CICLO[ciclo.id] ?? CalendarDays

  return (
    <div
      ref={ref}
      className={`${styles.card} ${visible ? styles.visible : ''}`}
      style={{ transitionDelay: `${retraso}ms`, '--ciclo-color': ciclo.color }}
      onClick={() => navegar.push(`/ciclos/${ciclo.id}`)}
    >
      <div className={styles.cardTop}>
        <div className={styles.iconBox}>
          <Icono size={20} strokeWidth={1.5} />
        </div>
        <span className={styles.tag} style={{ color: ciclo.color, borderColor: `${ciclo.color}55` }}>
          {ciclo.etiqueta}
        </span>
      </div>

      <div>
        <h3 className={styles.name}>{ciclo.nombre}</h3>
        <p className={styles.desc}>{ciclo.descripcion}</p>
      </div>

      <div className={styles.statsGrid}>
        {(ciclo.estadisticas ?? []).map((e) => (
          <div key={e.etiqueta} className={styles.stat}>
            <span className={styles.statNum} style={{ color: ciclo.color }}>{e.numero}</span>
            <span className={styles.statLabel}>{e.etiqueta}</span>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.price}>
          <span className={styles.priceNum}>{ciclo.etiquetaPrecio}</span>
          <span className={styles.priceSub}>{ciclo.subPrecio}</span>
        </div>
        <span className={styles.cta}>
          Ver detalles <ArrowRight size={12} className={styles.ctaArrow} />
        </span>
      </div>
    </div>
  )
}

export default function PaginaCiclos({ ciclos }) {
  const navegar = useRouter()

  return (
    <div className="contenedor-seccion" style={{ paddingTop: 100 }}>
      <button onClick={() => navegar.push('/')} className={styles.backBtn}>
        ← Inicio
      </button>

      <div className="etiqueta-seccion">Programas académicos</div>
      <h1 className="titulo-seccion">Ciclos disponibles</h1>

      <p className={styles.intro}>
        Elige el programa que mejor se adapta a tu nivel y disponibilidad de tiempo.
      </p>

      <div className={styles.grid}>
        {ciclos.map((c, i) => (
          <TarjetaCiclo key={c.id} ciclo={c} retraso={i * 100} />
        ))}
      </div>
    </div>
  )
}
