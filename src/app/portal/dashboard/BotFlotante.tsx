'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bot } from 'lucide-react'
import styles from './dashboard.module.css'

const MENSAJES_DIA = [
  '¿Estudiamos juntos?',
  '¡Tengo preguntas! ',
  '¿Un repaso rápido?',
  '¡Practica hoy!',
  'ERROR:#400',
  '¿Listo para el reto?',
  '¡Hey...! ',
  '¿Me buscabas?',
  '¡Nuevo desafío!',
  'Hola, estoy listo!!',
]

const MENSAJES_NOCHE = [
  'Zzzz...',
  'Buenas noches 🌙',
  'Zzzz... 😴',
  '¡Descansa bien!',
  'Zzzz...',
  'Descanza wawita',
]

function isNoche() {
  const h = new Date().getHours()
  return h >= 19 || h < 5
}

function saludoInicial(nombre: string) {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return `¡Buenos días, ${nombre}!`
  if (h >= 12 && h < 19) return `¡Buenas tardes, ${nombre}!`
  return `¡Buenas noches, ${nombre}!`
}

type Pos = { x: number; y: number }

export default function BotFlotante({ nombre }: { nombre: string }) {
  const router  = useRouter()
  const [mensaje, setMensaje] = useState('')
  const [visible, setVisible] = useState(false)
  const [burbuja, setBurbuja] = useState(false)
  const [pos, setPos]         = useState<Pos | null>(null)
  const [dragging, setDragging] = useState(false)

  const idxRef    = useRef(0)
  const timer     = useRef<ReturnType<typeof setTimeout>>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const drag      = useRef<{
    ox: number; oy: number
    startX: number; startY: number
    moved: boolean
  } | null>(null)

  /* ── Ciclo de mensajes ── */
  useEffect(() => {
    setMensaje(saludoInicial(nombre))

    function ocultar() {
      setBurbuja(false)
      timer.current = setTimeout(mostrar, 20_000)
    }
    function mostrar() {
      const lista = isNoche() ? MENSAJES_NOCHE : MENSAJES_DIA
      idxRef.current = (idxRef.current + 1) % lista.length
      setMensaje(lista[idxRef.current])
      setBurbuja(true)
      timer.current = setTimeout(ocultar, 10_000)
    }

    timer.current = setTimeout(() => {
      setVisible(true)
      setBurbuja(true)
      timer.current = setTimeout(ocultar, 10_000)
    }, 600)

    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [nombre])

  /* ── Posición guardada ── */
  useEffect(() => {
    try {
      const s = localStorage.getItem('bot-pos')
      if (s) setPos(JSON.parse(s))
    } catch {}
  }, [])

  /* ── Drag handlers ── */
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = e.currentTarget.getBoundingClientRect()
    drag.current = {
      ox:     e.clientX - rect.left,
      oy:     e.clientY - rect.top,
      startX: e.clientX,
      startY: e.clientY,
      moved:  false,
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    if (!drag.current.moved && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      drag.current.moved = true
      setDragging(true)
    }
    if (!drag.current.moved) return

    const el = e.currentTarget
    const w  = el.offsetWidth
    const h  = el.offsetHeight
    const x  = Math.max(8, Math.min(e.clientX - drag.current.ox, window.innerWidth  - w - 8))
    const y  = Math.max(8, Math.min(e.clientY - drag.current.oy, window.innerHeight - h - 8))
    setPos({ x, y })
  }

  function onPointerUp() {
    if (!drag.current) return
    if (!drag.current.moved) {
      router.push('/portal/repaso')
    } else if (pos) {
      try { localStorage.setItem('bot-pos', JSON.stringify(pos)) } catch {}
    }
    drag.current = null
    setDragging(false)
  }

  if (!visible) return null

  const inlineStyle: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' }
    : {}

  return (
    <div
      ref={widgetRef}
      className={`${styles.botWidget} ${dragging ? styles.botWidgetDragging : ''}`}
      style={inlineStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      title="Bot de Repaso · arrastra para mover"
    >
      <div className={`${styles.botBurbuja} ${burbuja && !dragging ? '' : styles.botBurbujaOculta}`}>
        {mensaje}
      </div>
      <div className={styles.botCirculo}>
        <Bot size={28} />
      </div>
    </div>
  )
}
