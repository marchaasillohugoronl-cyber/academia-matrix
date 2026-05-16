'use client'
import { useRouter }       from 'next/navigation'
import Link                from 'next/link'
import * as Icons          from 'lucide-react'
import {
  CalendarDays, Rocket, Clock, Banknote,
  MapPin, Phone, Map, ArrowRight,
} from 'lucide-react'
import BarraCTAMobile      from '@/componentes/BarraCTAMobile'
import styles from './PaginaDetalleCiclo.module.css'

export default function PaginaDetalleCiclo({ ciclo, niveles, cursos, sitio }) {
  const navegar = useRouter()

  const nivelesDisponibles =
    ciclo.niveles && ciclo.niveles.length > 0
      ? niveles.filter((n) => ciclo.niveles.includes(n.id))
      : niveles

  return (
    <>
    <div className={styles.page}>
      <div className={styles.header} style={{ '--ciclo-color': ciclo.color }}>
        <div className={styles.headerInner}>
          <button className="boton-volver" onClick={() => navegar.push('/ciclos')}>
            ← Ciclos
          </button>

          <div className={styles.headerTop}>
            <div className={styles.accentBar} style={{ background: ciclo.color }} />
            <div>
              <div className={styles.tag} style={{ color: ciclo.color, borderColor: `${ciclo.color}55` }}>
                {ciclo.etiqueta}
              </div>
              <h1 className={styles.title}>{ciclo.nombre}</h1>
              <p className={styles.desc}>{ciclo.descripcion}</p>
            </div>
          </div>

          <div className={styles.statsBar}>
            {(ciclo.estadisticas ?? []).map((e) => (
              <div key={e.etiqueta} className={styles.stat}>
                <span className={styles.statNum} style={{ color: ciclo.color }}>{e.numero}</span>
                <span className={styles.statLabel}>{e.etiqueta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Fechas e info */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}><CalendarDays size={18} /></span>
            <div className={styles.infoLabel}>Inscripciones</div>
            <div className={styles.infoValue}>{ciclo.inicioInscripcion ?? '—'}</div>
            <div className={styles.infoSub}>hasta el {ciclo.finInscripcion ?? '—'}</div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.infoIcon}><Rocket size={18} /></span>
            <div className={styles.infoLabel}>Inicio de clases</div>
            <div className={styles.infoValue}>{ciclo.inicioClases ?? '—'}</div>
          </div>

          {ciclo.turnos && ciclo.turnos.length > 0 && (
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}><Clock size={18} /></span>
              <div className={styles.infoLabel}>Turnos disponibles</div>
              <div className={styles.infoValue}>{ciclo.turnos.join(' y ')}</div>
            </div>
          )}

          <div className={styles.infoCard} style={{ borderTopColor: ciclo.color }}>
            <span className={styles.infoIcon} style={{ color: ciclo.color }}><Banknote size={18} /></span>
            <div className={styles.infoLabel}>Inversión</div>
            <div className={styles.infoValue} style={{ color: ciclo.color }}>{ciclo.etiquetaPrecio}</div>
            <div className={styles.infoSub}>{ciclo.subPrecio}</div>
          </div>
        </div>

        {/* Niveles */}
        <div className={styles.section}>
          <div className="etiqueta-seccion">Niveles disponibles</div>
          <h2 className={styles.sectionTitle}>Elige tu nivel</h2>

          <div className={styles.levelsGrid}>
            {nivelesDisponibles.map((nivel) => {
              const IconoNivel = nivel.icono ? Icons[nivel.icono] : null
              const cursosNivel = cursos[nivel.id] ?? []
              return (
                <Link
                  key={nivel.id}
                  href={`/ciclos/${ciclo.id}/nivel/${nivel.id}`}
                  className={styles.levelCard}
                  style={{ '--level-color': nivel.color }}
                >
                  <div className={styles.levelIconBox} style={{ borderColor: `${nivel.color}44`, color: nivel.color }}>
                    {IconoNivel && <IconoNivel size={22} strokeWidth={1.5} />}
                  </div>
                  <div className={styles.levelInfo}>
                    <span className={styles.levelName}>{nivel.nombre}</span>
                    <span className={styles.levelCourses}>{cursosNivel.length} cursos</span>
                  </div>
                  <ArrowRight size={14} className={styles.levelArrow} />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Ubicación */}
        <div className={styles.section}>
          <div className="etiqueta-seccion">Cómo llegar</div>
          <h2 className={styles.sectionTitle}>Ubicación</h2>

          <div className={styles.locationGrid}>
            <div className={styles.locationInfo}>
              <div className={styles.locItem}>
                <MapPin size={16} className={styles.locIcono} />
                <div>
                  <div className={styles.locLabel}>Lugar de inscripciones</div>
                  <div className={styles.locValue}>{sitio?.lugarInscripcion ?? ''}</div>
                </div>
              </div>
              <div className={styles.locItem}>
                <MapPin size={16} className={styles.locIcono} />
                <div>
                  <div className={styles.locLabel}>Lugar de clases</div>
                  <div className={styles.locValue}>{sitio?.lugarClases ?? ''}</div>
                </div>
              </div>
              <div className={styles.locItem}>
                <Phone size={16} className={styles.locIcono} />
                <div>
                  <div className={styles.locLabel}>Informes</div>
                  <div className={styles.locValue}>{sitio?.telefono ?? ''}</div>
                </div>
              </div>
              <div className={styles.locButtons}>
                <a href={sitio?.whatsapp ?? '#'} target="_blank" rel="noreferrer" className={styles.waBtn}>
                  <Phone size={16} /> Inscribirme por WhatsApp
                </a>
                <a href={sitio?.urlMapa ?? '#'} target="_blank" rel="noreferrer" className={styles.mapsBtn}>
                  <Map size={16} /> Ver en Google Maps
                </a>
              </div>
            </div>

            <div className={styles.mapContainer}>
              <iframe
                title="Ubicación Academia MATRIX"
                src="https://maps.google.com/maps?q=Cabanillas,Puno,Peru&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 240 }}
                loading="lazy"
              />
            </div>
          </div>
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
