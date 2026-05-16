'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
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
  'Hola, estoy listo!!'
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

export default function BotFlotante({ nombre }: { nombre: string }) {
  const [mensaje, setMensaje] = useState('')
  const [visible, setVisible] = useState(false)  // widget montado
  const [burbuja, setBurbuja] = useState(false)  // burbuja visible
  const idxRef = useRef(0)
  const timer  = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    // Mostrar saludo inicial según la hora
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

    // Aparece el widget 0.6 s después, muestra saludo 10 s y empieza el ciclo
    timer.current = setTimeout(() => {
      setVisible(true)
      setBurbuja(true)
      timer.current = setTimeout(ocultar, 10_000)
    }, 600)

    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [nombre])

  if (!visible) return null

  return (
    <Link href="/portal/repaso" className={styles.botWidget} title="Bot de Repaso">
      <div className={`${styles.botBurbuja} ${burbuja ? '' : styles.botBurbujaOculta}`}>
        {mensaje}
      </div>
      <div className={styles.botCirculo}>
        <Bot size={28} />
      </div>
    </Link>
  )
}
