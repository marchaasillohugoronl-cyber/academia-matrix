import Link            from 'next/link'
import { db }          from '@/lib/db'
import { ciclos, alumnos, anuncios, examenes, encuestas } from '@/lib/db/schema'
import {
  CalendarDays, Settings, Globe, ArrowRight,
  Headset, Users, Megaphone, BookOpen, ClipboardList,
} from 'lucide-react'
import styles from './admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [ciclosData, alumnosData, anunciosData, examenesData, encuestasData] = await Promise.all([
    db.select().from(ciclos),
    db.select({ id: alumnos.id }).from(alumnos),
    db.select({ id: anuncios.id, publicado: anuncios.publicado }).from(anuncios),
    db.select({ id: examenes.id, activo: examenes.activo }).from(examenes),
    db.select({ id: encuestas.id, activa: encuestas.activa }).from(encuestas),
  ])

  const nCiclosActivos  = ciclosData.filter((c) => c.activo).length
  const nPublicados     = anunciosData.filter((a) => a.publicado).length
  const nExamenesActivos = examenesData.filter((e) => e.activo).length
  const nEncuestasActivas = encuestasData.filter((e) => e.activa).length

  const CARDS = [
    {
      href:  '/admin/alumnos',
      Icon:  Users,
      title: 'Alumnos',
      desc:  'Lista de alumnos registrados, filtros por ciclo y nivel.',
      count: `${alumnosData.length} registrados`,
      num:   alumnosData.length,
    },
    {
      href:  '/admin/anuncios',
      Icon:  Megaphone,
      title: 'Anuncios',
      desc:  'Publica comunicados visibles en el portal de los alumnos.',
      count: `${nPublicados} publicados`,
      num:   nPublicados,
    },
    {
      href:  '/admin/examenes',
      Icon:  BookOpen,
      title: 'Exámenes',
      desc:  'Crea exámenes con preguntas de opción múltiple o respuesta libre.',
      count: `${nExamenesActivos} activos`,
      num:   nExamenesActivos,
    },
    {
      href:  '/admin/encuestas',
      Icon:  ClipboardList,
      title: 'Encuestas',
      desc:  'Recoge opiniones y feedback de los alumnos con encuestas rápidas.',
      count: `${nEncuestasActivas} activas`,
      num:   nEncuestasActivas,
    },
    {
      href:  '/admin/ciclos',
      Icon:  CalendarDays,
      title: 'Ciclos',
      desc:  'Edita fechas, precios, turnos e inscripciones de cada ciclo.',
      count: `${ciclosData.length} ciclos · ${nCiclosActivos} activos`,
      num:   ciclosData.length,
    },
    {
      href:  '/admin/configuracion',
      Icon:  Settings,
      title: 'Configuración',
      desc:  'Teléfono, WhatsApp, ubicación de clases y datos de contacto.',
      count: 'Datos generales',
      num:   undefined as number | undefined,
    },
    {
      href:  '/',
      blank: true,
      Icon:  Globe,
      title: 'Ver sitio web',
      desc:  'Previsualizar la página pública tal como la ven los visitantes.',
      count: 'Nueva pestaña',
      num:   undefined as number | undefined,
    },
  ]

  return (
    <>
      {/* ── Banner superior full-width ── */}
      <div className={styles.dashBanner}>
        <div className={styles.dashBannerInner}>
          <div>
            <p className={styles.dashBannerTitulo}>Panel de Administración</p>
            <p className={styles.dashBannerSub}>
              Gestiona ciclos, alumnos, comunicados y evaluaciones.
            </p>
          </div>
          <div className={styles.dashStats}>
            <div className={styles.dashStat}>
              <span className={styles.dashStatNum}>{alumnosData.length}</span>
              <span className={styles.dashStatLabel}>Alumnos</span>
            </div>
            <div className={styles.dashStat}>
              <span className={styles.dashStatNum}>{ciclosData.length}</span>
              <span className={styles.dashStatLabel}>Ciclos</span>
            </div>
            <div className={styles.dashStat}>
              <span className={styles.dashStatNum}>{nCiclosActivos}</span>
              <span className={styles.dashStatLabel}>Activos</span>
            </div>
            <div className={styles.dashStat}>
              <span className={styles.dashStatNum}>{nPublicados}</span>
              <span className={styles.dashStatLabel}>Anuncios</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid de módulos ── */}
      <div className={styles.container}>
        <p className={styles.dashSectionLabel}>Módulos</p>

        <div className={styles.dashGrid}>
          {CARDS.map(({ href, blank, Icon, title, desc, count, num }) => (
            <Link
              key={href}
              href={href}
              target={blank ? '_blank' : undefined}
              rel={blank ? 'noreferrer' : undefined}
              className={styles.dashCard}
            >
              <div className={styles.dashCardTop}>
                <div className={styles.dashCardIconWrap}>
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                {num !== undefined && (
                  <span className={styles.dashCardCountBig}>{num}</span>
                )}
              </div>
              <div className={styles.dashCardContent}>
                <div className={styles.dashCardTitle}>{title}</div>
                <p className={styles.dashCardDesc}>{desc}</p>
              </div>
              <div className={styles.dashCardFooter}>
                <span className={styles.dashCardCount}>{count}</span>
                <ArrowRight size={14} className={styles.dashCardArrow} />
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.soporte}>
          <div>
            <p className={styles.soporteLabel}>Soporte técnico</p>
            <a href="mailto:marchaasillohugoronl@gmail.com" className={styles.soporteEmail}>
              marchaasillohugoronl@gmail.com
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Headset size={16} style={{ color: 'var(--atenuado)' }} />
            <span className={styles.soporteTexto}>
              Ante cualquier problema técnico, contacta al desarrollador.
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
