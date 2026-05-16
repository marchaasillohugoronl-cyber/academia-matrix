'use client'
import { useState, useCallback, useTransition, type ReactNode } from 'react'
import Link             from 'next/link'
import Image            from 'next/image'
import { logoutPortal } from '../actions'
import { Home, Bell, BookOpen, ClipboardList, LogOut, BrainCircuit, ArrowRight, UserCircle, CheckCircle2, Pencil } from 'lucide-react'
import AcordeonItem  from './AcordeonItem'
import BotFlotante   from './BotFlotante'
import styles from './dashboard.module.css'

type Tab = 'inicio' | 'examenes' | 'encuestas'

type Alumno = {
  id: string; nombre: string; apellidos: string
  dni: string; telefono: string | null
  emailAcademia: string | null; fotoUrl: string | null
  cicloNombre: string; nivelNombre: string; registradoEn: Date | null
}
type Anuncio  = { id: string; titulo: string; contenido: string; creadoEn: Date | null }
type Examen   = { id: string; titulo: string; descripcion: string | null; duracionMinutos: number | null }
type Encuesta = { id: string; titulo: string; descripcion: string | null }
type Props    = {
  alumno: Alumno; anuncios: Anuncio[]; examenes: Examen[]; encuestas: Encuesta[]
  examenesCompletados: Record<string, string>   // examenId → entregaId
  encuestasCompletadas: (string | null)[]        // array de encuestaIds
}

function formatFecha(d: Date | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function DashboardAlumno({ alumno, anuncios, examenes, encuestas, examenesCompletados, encuestasCompletadas }: Props) {
  const [pending, startTransition] = useTransition()
  const [tab, setTab] = useState<Tab>('inicio')
  const encuestasSet = new Set(encuestasCompletadas)

  const examenesPendientes  = examenes.filter((e) => !examenesCompletados[e.id]).length
  const encuestasPendientes = encuestas.filter((e) => !encuestasSet.has(e.id)).length
  const total = anuncios.length + examenesPendientes + encuestasPendientes

  const salir = useCallback(() => {
    startTransition(async () => { await logoutPortal() })
  }, [startTransition])

  const iniciales = `${alumno.nombre[0] ?? ''}${alumno.apellidos[0] ?? ''}`.toUpperCase()

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────── */}
      <header className={styles.appHeader}>
        <div className={styles.appHeaderBrand}>
          <span className={styles.appBrandDot} />
          <span className={styles.appBrandName}>Matrix</span>
          <span className={styles.appBrandSub}>Portal Alumno</span>
        </div>
        <div className={styles.appHeaderRight}>
          <Link href="/portal/perfil" className={styles.appPerfilBtn} title="Mi perfil">
            <UserCircle size={22}/>
          </Link>
          <button className={styles.appAvatar} onClick={salir} disabled={pending}
            title={pending ? 'Saliendo…' : 'Cerrar sesión'}>
            {alumno.fotoUrl && !pending
              ? <Image src={alumno.fotoUrl} alt={iniciales} width={36} height={36} className={styles.appAvatarImg} />
              : pending ? '…' : iniciales}
          </button>
        </div>
      </header>

      {/* ── Main ────────────────────────────────── */}
      <main className={styles.appMain}>

        <div className={styles.appWelcome}>
          {/* Foto */}
          <div className={styles.appWelcomeFotoWrap}>
            {alumno.fotoUrl
              ? <Image src={alumno.fotoUrl} alt={iniciales} width={72} height={72} className={styles.appWelcomeFoto} />
              : <span className={styles.appWelcomeIniciales}>{iniciales}</span>}
          </div>

          {/* Info + editar */}
          <div className={styles.appWelcomeInfo}>
            <p className={styles.appWelcomeHola}>Hola, bienvenido</p>
            <h1 className={styles.appWelcomeNombre}>{alumno.nombre} {alumno.apellidos}</h1>
            <div className={styles.appWelcomeChips}>
              <span className={styles.appChip}>{alumno.nivelNombre}</span>
              <span className={styles.appChip}>{alumno.cicloNombre}</span>
              <span className={styles.appChipDni}>DNI {alumno.dni}</span>
            </div>
            {alumno.emailAcademia && (
              <p className={styles.appWelcomeEmail}>{alumno.emailAcademia}</p>
            )}
            <Link href="/portal/perfil" className={styles.btnEditarPerfil}>
              <Pencil size={11}/> Editar mis datos
            </Link>
          </div>
        </div>

        <p className={styles.appSectionLabel}>
          {tab === 'inicio'    && `Resumen · ${total} pendiente${total !== 1 ? 's' : ''}`}
          {tab === 'examenes'  && 'Exámenes disponibles'}
          {tab === 'encuestas' && 'Encuestas activas'}
        </p>

        <div className={styles.appContent}>

          {/* ── INICIO: resumen completo en 2 columnas (desktop) ── */}
          {tab === 'inicio' && (
            <div className={styles.resumenGrid}>

              {/* Columna izquierda — Anuncios */}
              <div className={styles.resumenCol}>
                <SeccionHead icon={<Bell size={18}/>} titulo="Anuncios" count={anuncios.length} />
                {anuncios.length === 0
                  ? <VacioInline texto="No hay anuncios publicados" />
                  : <ul className={styles.appLista}>
                      {anuncios.map((a) => (
                        <AcordeonItem key={a.id} titulo={a.titulo}>
                          <p className={styles.itemTexto}>{a.contenido}</p>
                          <span className={styles.itemFecha}>{formatFecha(a.creadoEn)}</span>
                        </AcordeonItem>
                      ))}
                    </ul>}
              </div>

              {/* Columna derecha — Exámenes + Encuestas */}
              <div className={styles.resumenCol}>
                <SeccionHead icon={<BookOpen size={18}/>} titulo="Exámenes disponibles" count={examenes.length} />
                {examenes.length === 0
                  ? <VacioInline texto="No hay exámenes activos" />
                  : <ul className={styles.appLista}>
                      {examenes.map((e) => (
                        <AcordeonItem key={e.id} titulo={e.titulo}>
                          {e.descripcion && <p className={styles.itemTexto}>{e.descripcion}</p>}
                          {e.duracionMinutos && <span className={styles.itemMeta}>{e.duracionMinutos} min</span>}
                          {examenesCompletados[e.id]
                            ? <Link href={`/portal/examen/resultado/${examenesCompletados[e.id]}`} className={styles.itemCompletado}>
                                <CheckCircle2 size={14}/> Ya rendido · Ver resultado
                              </Link>
                            : <Link href={`/portal/examen/${e.id}`} className={styles.itemAccion}>
                                Rendir examen <ArrowRight size={15}/>
                              </Link>}
                        </AcordeonItem>
                      ))}
                    </ul>}

                <SeccionHead icon={<ClipboardList size={18}/>} titulo="Encuestas activas" count={encuestas.length} mt />
                {encuestas.length === 0
                  ? <VacioInline texto="No hay encuestas activas" />
                  : <ul className={styles.appLista}>
                      {encuestas.map((e) => (
                        <AcordeonItem key={e.id} titulo={e.titulo}>
                          {e.descripcion && <p className={styles.itemTexto}>{e.descripcion}</p>}
                          {encuestasSet.has(e.id)
                            ? <span className={styles.itemCompletado}><CheckCircle2 size={14}/> Ya respondida</span>
                            : <Link href={`/portal/encuesta/${e.id}`} className={styles.itemAccion}>
                                Ir a la encuesta <ArrowRight size={15}/>
                              </Link>}
                        </AcordeonItem>
                      ))}
                    </ul>}
              </div>

            </div>
          )}

          {/* ── EXÁMENES ── */}
          {tab === 'examenes' && (
            examenes.length === 0
              ? <Vacio icon={<BookOpen size={42} strokeWidth={1}/>} texto="No hay exámenes activos" />
              : <ul className={styles.appLista}>
                  {examenes.map((e) => (
                    <AcordeonItem key={e.id} titulo={e.titulo}>
                      {e.descripcion && <p className={styles.itemTexto}>{e.descripcion}</p>}
                      {e.duracionMinutos && <span className={styles.itemMeta}>{e.duracionMinutos} min</span>}
                      {examenesCompletados[e.id]
                        ? <Link href={`/portal/examen/resultado/${examenesCompletados[e.id]}`} className={styles.itemCompletado}>
                            <CheckCircle2 size={14}/> Ya rendido · Ver resultado
                          </Link>
                        : <Link href={`/portal/examen/${e.id}`} className={styles.itemAccion}>
                            Rendir examen <ArrowRight size={15}/>
                          </Link>}
                    </AcordeonItem>
                  ))}
                </ul>
          )}

          {/* ── ENCUESTAS ── */}
          {tab === 'encuestas' && (
            encuestas.length === 0
              ? <Vacio icon={<ClipboardList size={42} strokeWidth={1}/>} texto="No hay encuestas activas" />
              : <ul className={styles.appLista}>
                  {encuestas.map((e) => (
                    <AcordeonItem key={e.id} titulo={e.titulo}>
                      {e.descripcion && <p className={styles.itemTexto}>{e.descripcion}</p>}
                      {encuestasSet.has(e.id)
                        ? <span className={styles.itemCompletado}><CheckCircle2 size={14}/> Ya respondida</span>
                        : <Link href={`/portal/encuesta/${e.id}`} className={styles.itemAccion}>
                            Ir a la encuesta <ArrowRight size={15}/>
                          </Link>}
                    </AcordeonItem>
                  ))}
                </ul>
          )}

        </div>
      </main>

      {/* ── Nav (bottom en móvil, sidebar en desktop) ── */}
      <nav className={styles.appBottomNav}>

        <button
          className={`${styles.appNavItem} ${tab === 'inicio' ? styles.appNavActive : ''}`}
          onClick={() => setTab('inicio')}
        >
          <Home size={24}/>
          <span>Inicio</span>
          {total > 0 && tab !== 'inicio' && <span className={styles.appNavBadge}>{total}</span>}

        </button>

        <button
          className={`${styles.appNavItem} ${tab === 'examenes' ? styles.appNavActive : ''}`}
          onClick={() => setTab('examenes')}
        >
          <BookOpen size={24}/>
          <span>Exámenes</span>
          {examenesPendientes > 0 && tab !== 'examenes' && <span className={styles.appNavBadge}>{examenesPendientes}</span>}
        </button>

        {/* FAB en móvil · botón de texto en sidebar desktop */}
        <Link href="/portal/repaso" className={styles.appNavCenter}>
          <BrainCircuit size={24}/>
          <span className={styles.appNavCenterLabel}>Bot de Repaso</span>
        </Link>

        <button
          className={`${styles.appNavItem} ${tab === 'encuestas' ? styles.appNavActive : ''}`}
          onClick={() => setTab('encuestas')}
        >
          <ClipboardList size={24}/>
          <span>Encuestas</span>
          {encuestasPendientes > 0 && tab !== 'encuestas' && <span className={styles.appNavBadge}>{encuestasPendientes}</span>}
        </button>

        <span className={styles.appNavSeparador} aria-hidden />

        <button className={styles.appNavItem} onClick={salir} disabled={pending}>
          <LogOut size={24}/>
          <span>Salir</span>
        </button>

      </nav>

      {/* ── Bot flotante (esquina inferior derecha) ── */}
      <BotFlotante nombre={alumno.nombre} />

    </div>
  )
}

/* ── Helpers ────────────────────────────────────── */

function SeccionHead({ icon, titulo, count, mt }: {
  icon: ReactNode; titulo: string; count: number; mt?: boolean
}) {
  return (
    <div className={styles.seccionMiniHead} style={mt ? { marginTop: 14 } : undefined}>
      <span className={styles.seccionMiniIcono}>{icon}</span>
      <span className={styles.seccionMiniTitulo}>{titulo}</span>
      {count > 0 && <span className={styles.seccionMiniBadge}>{count}</span>}
    </div>
  )
}

function VacioInline({ texto }: { texto: string }) {
  return <p className={styles.vacioInline}>{texto}</p>
}

function Vacio({ icon, texto }: { icon: ReactNode; texto: string }) {
  return (
    <div className={styles.vacioCentro}>
      {icon}
      <p>{texto}</p>
    </div>
  )
}
