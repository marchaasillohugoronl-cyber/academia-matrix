'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bot, RotateCcw, ChevronRight, BookOpen, Shuffle } from 'lucide-react'
import { guardarResultadoBot } from './actions'
import styles from './repaso.module.css'

const LETRAS = ['A', 'B', 'C', 'D']

type PreguntaRepaso = {
  id: string; enunciado: string
  opciones: string[] | null; respuestaCorrecta: string | null
  examenTitulo: string
}
type PreguntaBot = {
  id: string; enunciado: string
  opciones: string[] | null; respuestaCorrecta: string | null
  puntaje: number | null
}
type ExamenDisponible = {
  id: string; titulo: string; descripcion: string | null
  preguntas: PreguntaBot[]
}
type Mensaje = { tipo: 'bot' | 'alumno' | 'feedback'; texto: string; correcto?: boolean }
type Fase = 'inicio' | 'repaso' | 'examen-lista' | 'examen'

export default function BotRepaso({
  preguntas,
  alumnoNombre,
  examenesDisponibles,
}: {
  preguntas: PreguntaRepaso[]
  alumnoNombre: string
  examenesDisponibles: ExamenDisponible[]
}) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { tipo: 'bot', texto: `¡Hola ${alumnoNombre}! Soy tu asistente de estudio. ¿Qué quieres hacer hoy?` },
  ])
  const [fase, setFase] = useState<Fase>('inicio')
  const bottomRef = useRef<HTMLDivElement>(null)

  // ── Estado repaso libre ──────────────────────────
  const [idxR,  setIdxR]  = useState(0)
  const [respR, setRespR] = useState(false)
  const [termR, setTermR] = useState(false)
  const corrRRef = useRef(0)   // ref para evitar stale closure en el mensaje final

  // ── Estado examen guiado ─────────────────────────
  const [examen, setExamen] = useState<ExamenDisponible | null>(null)
  const [idxE,   setIdxE]   = useState(0)
  const [respE,  setRespE]  = useState(false)
  const [termE,  setTermE]  = useState(false)
  const respsRef = useRef<Record<string, string>>({})

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  function add(m: Mensaje | Mensaje[]) {
    setMensajes((p) => [...p, ...(Array.isArray(m) ? m : [m])])
  }

  // ── Selección de modo ────────────────────────────
  function iniciarRepaso() {
    if (preguntas.length === 0) return
    setFase('repaso')
    corrRRef.current = 0
    add({ tipo: 'bot', texto: `¡Modo repaso! ${preguntas.length} preguntas mezcladas de todos los exámenes. ¡Empecemos! 🎯` })
    setTimeout(() => {
      add({ tipo: 'bot', texto: `Pregunta 1 de ${preguntas.length} — ${preguntas[0].examenTitulo}\n\n${preguntas[0].enunciado}` })
    }, 600)
  }

  function abrirListaExamenes() {
    setFase('examen-lista')
    add({ tipo: 'bot', texto: '¿Qué examen quieres rendir? Verás si cada respuesta es correcta o no, y al final registraré tu puntaje.' })
  }

  // ── Elegir examen ────────────────────────────────
  function elegirExamen(ex: ExamenDisponible) {
    setExamen(ex)
    setIdxE(0)
    setRespE(false)
    setTermE(false)
    respsRef.current = {}
    setFase('examen')
    add([
      { tipo: 'alumno', texto: ex.titulo },
      { tipo: 'bot', texto: `¡Empezamos "${ex.titulo}"! ${ex.preguntas.length} preguntas. Responde cada una y te mostraré si acertaste. 📝` },
    ])
    setTimeout(() => {
      add({ tipo: 'bot', texto: `Pregunta 1 de ${ex.preguntas.length}\n\n${ex.preguntas[0].enunciado}` })
    }, 700)
  }

  // ── Repaso libre: responder ──────────────────────
  function responderRepaso(opcionIdx: number) {
    if (respR) return
    const p = preguntas[idxR]
    const ok = String(opcionIdx) === p.respuestaCorrecta
    const opTxt   = p.opciones?.[opcionIdx] ?? ''
    const corrTxt = p.opciones?.[Number(p.respuestaCorrecta)] ?? ''
    if (ok) corrRRef.current++
    setRespR(true)
    add([
      { tipo: 'alumno', texto: `${LETRAS[opcionIdx]}) ${opTxt}` },
      {
        tipo: 'feedback', correcto: ok,
        texto: ok
          ? '¡Correcto! ✓'
          : `Incorrecto. La respuesta correcta era:\n${LETRAS[Number(p.respuestaCorrecta)]}) ${corrTxt}`,
      },
    ])
  }

  function siguienteRepaso() {
    const next = idxR + 1
    if (next >= preguntas.length) {
      const c = corrRRef.current
      const pct = Math.round((c / preguntas.length) * 100)
      setTermR(true)
      add({ tipo: 'bot', texto: `¡Sesión completada! Acertaste ${c} de ${preguntas.length} preguntas (${pct}%). ${pct >= 70 ? '¡Excelente! 🏆' : 'Sigue practicando 💪'}` })
    } else {
      setIdxR(next)
      setRespR(false)
      setTimeout(() => {
        add({ tipo: 'bot', texto: `Pregunta ${next + 1} de ${preguntas.length} — ${preguntas[next].examenTitulo}\n\n${preguntas[next].enunciado}` })
      }, 400)
    }
  }

  function reiniciarRepaso() {
    corrRRef.current = 0
    setIdxR(0); setRespR(false); setTermR(false)
    setMensajes([{ tipo: 'bot', texto: `¡Nueva sesión! ${preguntas.length} preguntas. ¿Listo? 🚀` }])
    setTimeout(() => {
      add({ tipo: 'bot', texto: `Pregunta 1 de ${preguntas.length} — ${preguntas[0].examenTitulo}\n\n${preguntas[0].enunciado}` })
    }, 400)
  }

  // ── Examen guiado: responder ─────────────────────
  function responderExamen(opcionIdx: number) {
    if (respE || !examen) return
    const p = examen.preguntas[idxE]
    respsRef.current[p.id] = String(opcionIdx)
    const ok = String(opcionIdx) === p.respuestaCorrecta
    const opTxt   = p.opciones?.[opcionIdx] ?? ''
    const corrTxt = p.opciones?.[Number(p.respuestaCorrecta)] ?? ''
    setRespE(true)
    add([
      { tipo: 'alumno', texto: `${LETRAS[opcionIdx]}) ${opTxt}` },
      {
        tipo: 'feedback', correcto: ok,
        texto: ok
          ? '¡Correcto! ✓'
          : `Incorrecto. La respuesta correcta era:\n${LETRAS[Number(p.respuestaCorrecta)]}) ${corrTxt}`,
      },
    ])
  }

  function siguienteExamen() {
    if (!examen) return
    const next = idxE + 1
    if (next >= examen.preguntas.length) {
      // Calcular puntaje desde las respuestas guardadas
      let puntaje = 0
      let correctas = 0
      for (const p of examen.preguntas) {
        if (respsRef.current[p.id] === p.respuestaCorrecta) {
          correctas++
          puntaje += p.puntaje ?? 1
        }
      }
      const total = examen.preguntas.reduce((s, p) => s + (p.puntaje ?? 1), 0)
      const pct = Math.round((puntaje / total) * 100)
      setTermE(true)
      add({
        tipo: 'bot',
        texto: `¡Examen completado! Obtuviste ${puntaje}/${total} puntos (${pct}%). ${pct >= 60 ? '¡Aprobado! 🏆' : 'Sigue estudiando, lo lograrás 💪'}`,
      })
      // Guardar en el panel de admin (solo primer intento, el servidor lo maneja)
      guardarResultadoBot(examen.id, { ...respsRef.current }, puntaje).catch(() => {})
    } else {
      setIdxE(next)
      setRespE(false)
      setTimeout(() => {
        add({ tipo: 'bot', texto: `Pregunta ${next + 1} de ${examen.preguntas.length}\n\n${examen.preguntas[next].enunciado}` })
      }, 400)
    }
  }

  function reiniciarExamen() {
    if (!examen) return
    respsRef.current = {}
    setIdxE(0); setRespE(false); setTermE(false)
    setMensajes([{ tipo: 'bot', texto: `¡Otra vuelta con "${examen.titulo}"! ${examen.preguntas.length} preguntas. ¡Vamos! 🚀` }])
    setTimeout(() => {
      add({ tipo: 'bot', texto: `Pregunta 1 de ${examen.preguntas.length}\n\n${examen.preguntas[0].enunciado}` })
    }, 500)
  }

  // ── Progreso barra + contador ────────────────────
  const totalActual  = fase === 'repaso' ? preguntas.length : (examen?.preguntas.length ?? 0)
  const idxActual    = fase === 'repaso' ? idxR : idxE
  const showProgress = fase === 'repaso' || fase === 'examen'

  const preguntaR = preguntas[idxR]
  const preguntaE = examen?.preguntas[idxE]

  // ── Sin preguntas disponibles ────────────────────
  if (preguntas.length === 0 && examenesDisponibles.length === 0) {
    return (
      <div className={styles.page}>
        <header className={styles.topbar}>
          <div className={styles.topbarLogo}>
            <span className={styles.topbarMarca}>MATRIX</span>
            <span className={styles.topbarSub}>Bot de Repaso</span>
          </div>
          <Link href="/portal/dashboard" className={styles.btnVolver}><ArrowLeft size={13} /> Dashboard</Link>
        </header>
        <div className={styles.vacio}>
          <Bot size={48} strokeWidth={1} />
          <p>No hay preguntas de práctica disponibles todavía.</p>
          <Link href="/portal/dashboard" className={styles.btnDash}>Volver al dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLogo}>
          <span className={styles.topbarMarca}>MATRIX</span>
          <span className={styles.topbarSub}>
            {fase === 'examen' && examen ? examen.titulo : 'Bot de Repaso'}
          </span>
        </div>
        <div className={styles.topbarRight}>
          {showProgress && (
            <span className={styles.progreso}>
              {Math.min(idxActual + 1, totalActual)}/{totalActual}
            </span>
          )}
          <Link href="/portal/dashboard" className={styles.btnVolver}>
            <ArrowLeft size={13} /> Salir
          </Link>
        </div>
      </header>

      {/* Barra de progreso */}
      <div className={styles.progresoBar}>
        <div
          className={styles.progresoFill}
          style={{ width: showProgress ? `${(idxActual / totalActual) * 100}%` : '0%' }}
        />
      </div>

      {/* Chat */}
      <div className={styles.chat}>
        {mensajes.map((m, i) => (
          <div
            key={i}
            className={`${styles.burbuja} ${
              m.tipo === 'alumno'   ? styles.burbujaAlumno :
              m.tipo === 'feedback' ? (m.correcto ? styles.burbujaOk : styles.burbujaMal) :
              styles.burbujaBot
            }`}
          >
            {m.tipo === 'bot' && <div className={styles.botIcono}><Bot size={14} /></div>}
            <p className={styles.burbujaTexto} style={{ whiteSpace: 'pre-line' }}>{m.texto}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Área de interacción */}
      <div className={styles.inputArea}>

        {/* ── INICIO: elegir modo ── */}
        {fase === 'inicio' && (
          <div className={styles.modoSeleccion}>
            {preguntas.length > 0 && (
              <button className={styles.modoBtn} onClick={iniciarRepaso}>
                <div className={styles.modoBtnIcono}><Shuffle size={16} /></div>
                <div className={styles.modoBtnInfo}>
                  <p className={styles.modoBtnTitulo}>Repaso libre</p>
                  <p className={styles.modoBtnSub}>{preguntas.length} preguntas mezcladas de todos los exámenes</p>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--atenuado)', flexShrink: 0 }} />
              </button>
            )}
            {examenesDisponibles.length > 0 && (
              <button className={styles.modoBtn} onClick={abrirListaExamenes}>
                <div className={styles.modoBtnIcono}><BookOpen size={16} /></div>
                <div className={styles.modoBtnInfo}>
                  <p className={styles.modoBtnTitulo}>Rendir un examen</p>
                  <p className={styles.modoBtnSub}>
                    {examenesDisponibles.length} examen{examenesDisponibles.length !== 1 ? 'es' : ''} disponible{examenesDisponibles.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--atenuado)', flexShrink: 0 }} />
              </button>
            )}
          </div>
        )}

        {/* ── LISTA DE EXÁMENES ── */}
        {fase === 'examen-lista' && (
          <div className={styles.listaExamenes}>
            {examenesDisponibles.map((ex) => (
              <button key={ex.id} className={styles.examenBtn} onClick={() => elegirExamen(ex)}>
                <span className={styles.opcionLetra}><BookOpen size={11} /></span>
                <span className={styles.opcionTexto}>{ex.titulo}</span>
                <span className={styles.examenBtnMeta}>{ex.preguntas.length} preg.</span>
                <ChevronRight size={13} style={{ color: 'var(--atenuado)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}

        {/* ── REPASO LIBRE: opciones ── */}
        {fase === 'repaso' && !termR && !respR && preguntaR && (
          <div className={styles.opciones}>
            {preguntaR.opciones?.map((op, idx) => op && (
              <button key={idx} className={styles.opcionBtn} onClick={() => responderRepaso(idx)}>
                <span className={styles.opcionLetra}>{LETRAS[idx]}</span>
                <span className={styles.opcionTexto}>{op}</span>
              </button>
            ))}
          </div>
        )}
        {fase === 'repaso' && !termR && respR && (
          <button className={styles.btnSiguiente} onClick={siguienteRepaso}>
            {idxR + 1 >= preguntas.length ? 'Ver resultado final' : 'Siguiente pregunta'}
            <ChevronRight size={14} />
          </button>
        )}
        {fase === 'repaso' && termR && (
          <div className={styles.finalBtns}>
            <button className={styles.btnReiniciar} onClick={reiniciarRepaso}>
              <RotateCcw size={14} /> Practicar de nuevo
            </button>
            <Link href="/portal/dashboard" className={styles.btnDash}>
              <ArrowLeft size={13} /> Dashboard
            </Link>
          </div>
        )}

        {/* ── EXAMEN GUIADO: opciones ── */}
        {fase === 'examen' && !termE && !respE && preguntaE && (
          <div className={styles.opciones}>
            {preguntaE.opciones?.map((op, idx) => op && (
              <button key={idx} className={styles.opcionBtn} onClick={() => responderExamen(idx)}>
                <span className={styles.opcionLetra}>{LETRAS[idx]}</span>
                <span className={styles.opcionTexto}>{op}</span>
              </button>
            ))}
          </div>
        )}
        {fase === 'examen' && !termE && respE && (
          <button className={styles.btnSiguiente} onClick={siguienteExamen}>
            {idxE + 1 >= (examen?.preguntas.length ?? 0) ? 'Ver resultado final' : 'Siguiente pregunta'}
            <ChevronRight size={14} />
          </button>
        )}
        {fase === 'examen' && termE && (
          <div className={styles.finalBtns}>
            <button className={styles.btnReiniciar} onClick={reiniciarExamen}>
              <RotateCcw size={14} /> Intentar de nuevo
            </button>
            <Link href="/portal/dashboard" className={styles.btnDash}>
              <ArrowLeft size={13} /> Dashboard
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
