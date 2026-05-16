'use client'
import { useState, type ReactNode } from 'react'
import { ChevronDown }              from 'lucide-react'
import styles from './dashboard.module.css'

export default function AcordeonItem({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false)
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
      <div className={`${styles.anuncioCuerpo} ${abierto ? styles.anuncioCuerpoAbierto : ''}`}>
        <div className={styles.anuncioCuerpoInner}>{children}</div>
      </div>
    </li>
  )
}
