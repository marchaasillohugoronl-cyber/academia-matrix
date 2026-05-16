'use client'
import { useAparecer } from './useAparecer'
import { useRouter }   from 'next/navigation'
import styles from './SeccionNiveles.module.css'
import { BookOpen, GraduationCap, Target } from 'lucide-react'

const NIVELES = [
  { id: 'primaria',        icono: BookOpen,      nombre: 'Primaria' },
  { id: 'secundaria',      icono: GraduationCap, nombre: 'Secundaria' },
  { id: 'preuniversitario', icono: Target,       nombre: 'Preuniversitario' },
]

function BotonNivel({ icono: Icono, nombre, id, retraso }) {
  const { ref, visible } = useAparecer()
  const navegar = useRouter()

  return (
    <button
      ref={ref}
      onClick={() => navegar.push(`/ciclos/sabatino/nivel/${id}`)}
      className={`${styles.btn} ${visible ? styles.visible : ''}`}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      <Icono size={26} />
      <span>{nombre}</span>
    </button>
  )
}

export default function SeccionNiveles() {
  return (
    <section id="niveles" className="contenedor-seccion">
      <div className="etiqueta-seccion">Cobertura académica</div>
      <h2 className="titulo-seccion">Niveles disponibles</h2>
      <div className={styles.buttons}>
        {NIVELES.map((n, i) => (
          <BotonNivel key={n.nombre} {...n} retraso={i * 120} />
        ))}
      </div>
    </section>
  )
}
