'use client'
import { useState, useRef, useLayoutEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './dashboard.module.css'

type Props = {
  titulo: string
  contenido: string
  fecha: string
}

export default function AnuncioItem({ titulo, contenido, fecha }: Props) {
  const [abierto, setAbierto] = useState(false)
  const cuerpoRef = useRef<HTMLDivElement>(null)
  const [altura, setAltura] = useState(0)

  useLayoutEffect(() => {
    if (cuerpoRef.current) setAltura(cuerpoRef.current.scrollHeight)
  }, [contenido])

  return (
    <li className={`${styles.itemAnuncio} ${abierto ? styles.itemAnuncioAbierto : ''}`}>
      <button
        className={styles.anuncioBtn}
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
      >
        <span className={styles.itemTitulo}>{titulo}</span>
        <ChevronDown
          size={16}
          className={`${styles.anuncioChevron} ${abierto ? styles.anuncioChevronOpen : ''}`}
        />
      </button>

      <div
        className={styles.anuncioCuerpo}
        style={{ maxHeight: abierto ? `${altura}px` : '0px' }}
      >
        <div ref={cuerpoRef} className={styles.anuncioCuerpoInner}>
          <p className={styles.itemTexto}>{contenido}</p>
          <span className={styles.itemFecha}>{fecha}</span>
        </div>
      </div>
    </li>
  )
}
