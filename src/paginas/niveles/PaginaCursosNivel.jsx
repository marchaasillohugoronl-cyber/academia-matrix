'use client'
import { useRouter }      from 'next/navigation'
import * as Icons         from 'lucide-react'
import BarraCTAMobile     from '@/componentes/BarraCTAMobile'
import {
  Clock, BookOpen, Rocket, Timer, Phone,
  Hash, Waves, Zap, FlaskConical,
  Brain, Variable, Shapes, ChevronRight,
} from 'lucide-react'
import styles from './PaginaCursosNivel.module.css'

const ICONOS_CURSO = {
  'álgebra':                   Variable,
  'aritmética':                Hash,
  'geometría':                 Shapes,
  'trigonometría':             Waves,
  'física':                    Zap,
  'química':                   FlaskConical,
  'razonamiento matemático':   Brain,
  'razonamiento verbal':       BookOpen,
}

function obtenerIconoCurso(nombre) {
  const clave = nombre.toLowerCase()
  for (const [key, Icon] of Object.entries(ICONOS_CURSO)) {
    if (clave.includes(key)) return Icon
  }
  return BookOpen
}

export default function PaginaCursosNivel({ ciclo, nivel, cursos, sitio }) {
  const navegar = useRouter()
  const IconoNivel = nivel.icono ? Icons[nivel.icono] : null

  return (
    <>
    <div className={styles.page}>
      <div className={styles.header} style={{ '--level-color': nivel.color }}>
        <div className={styles.headerInner}>
          <div className={styles.breadcrumb}>
            <button type="button" className="boton-volver" onClick={() => navegar.push('/ciclos')}>
              Ciclos
            </button>
            <ChevronRight size={14} className={styles.sep} />
            <button type="button" className="boton-volver" onClick={() => navegar.push(`/ciclos/${ciclo.id}`)}>
              {ciclo.nombre}
            </button>
            <ChevronRight size={14} className={styles.sep} />
            <span className={styles.current}>{nivel.nombre}</span>
          </div>

          <div className={styles.headerTop}>
            <div className={styles.levelIconBox} style={{ borderColor: `${nivel.color}44`, color: nivel.color }}>
              {IconoNivel && <IconoNivel size={28} strokeWidth={1.5} />}
            </div>
            <div>
              <div className={styles.badge} style={{ color: nivel.color, borderColor: `${nivel.color}44` }}>
                {ciclo.nombre}
              </div>
              <h1 className={styles.title}>Nivel {nivel.nombre}</h1>
              <p className={styles.sub}>{cursos.length} cursos disponibles en este nivel</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div>
          <div className="etiqueta-seccion">Contenido académico</div>
          <h2 className={styles.sectionTitle}>Plan de estudios</h2>

          <div className={styles.coursesGrid}>
            {cursos.map((curso, i) => {
              const IconoCurso = obtenerIconoCurso(curso.nombre)
              return (
                <div
                  key={curso.id ?? curso.nombre}
                  className={styles.courseCard}
                  style={{ animationDelay: `${i * 55}ms`, '--level-color': nivel.color }}
                >
                  <div className={styles.courseNum}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className={styles.courseIconWrap}>
                    <IconoCurso size={22} strokeWidth={1.5} />
                  </div>
                  <div className={styles.courseName}>{curso.nombre}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.summary} style={{ '--level-color': nivel.color }}>
          <div className={styles.summaryTitle}>Resumen del ciclo</div>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <Clock size={17} />
              <div>
                <div className={styles.summaryLabel}>Duración</div>
                <div className={styles.summaryValue}>{ciclo.duracion}</div>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <BookOpen size={17} />
              <div>
                <div className={styles.summaryLabel}>Total horas</div>
                <div className={styles.summaryValue}>{ciclo.totalHoras}</div>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <Rocket size={17} />
              <div>
                <div className={styles.summaryLabel}>Inicio</div>
                <div className={styles.summaryValue}>{ciclo.inicioClases}</div>
              </div>
            </div>
            {ciclo.turnos && ciclo.turnos.length > 0 && (
              <div className={styles.summaryItem}>
                <Timer size={17} />
                <div>
                  <div className={styles.summaryLabel}>Turnos</div>
                  <div className={styles.summaryValue}>{ciclo.turnos.join(' / ')}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.cta} style={{ '--level-color': nivel.color }}>
          <div>
            <h3 className={styles.ctaTitle}>
              ¿Listo para inscribirte en{' '}
              <span style={{ color: nivel.color }}>nivel {nivel.nombre}</span>?
            </h3>
            <p className={styles.ctaSub}>
              Inscripciones: {ciclo.inicioInscripcion} — {ciclo.finInscripcion}
            </p>
          </div>
          <a
            href={sitio?.whatsapp ?? '#'}
            target="_blank"
            rel="noreferrer"
            className={styles.waBtn}
          >
            <Phone size={16} />
            Inscribirme · {sitio?.telefono ?? ''}
          </a>
        </div>
      </div>
    </div>

    <BarraCTAMobile
      href={sitio?.whatsapp ?? '#'}
      telefono={sitio?.telefono}
      label="Inscribirme ahora"
    />
    </>
  )
}
