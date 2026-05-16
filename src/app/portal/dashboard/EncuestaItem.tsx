'use client'
import { useState, useRef, useLayoutEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import styles from './dashboard.module.css'

type Props = {
  id: string
  titulo: string
  descripcion: string | null
}

export default function EncuestaItem({ id, titulo, descripcion }: Props) {
  const [abierto, setAbierto] = useState(false)
  const cuerpoRef = useRef<HTMLDivElement>(null)
  const [altura, setAltura] = useState(0)

  useLayoutEffect(() => {
    if (cuerpoRef.current) setAltura(cuerpoRef.current.scrollHeight)
  }, [descripcion])

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
          {descripcion && <p className={styles.itemTexto}>{descripcion}</p>}
          <Link href={`/portal/encuesta/${id}`} className={styles.itemAccion}>
            Ir a la encuesta
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </li>
  )
}
