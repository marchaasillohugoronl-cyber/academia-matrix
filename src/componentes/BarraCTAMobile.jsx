'use client'
import { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import styles from './BarraCTAMobile.module.css'

export default function BarraCTAMobile({ href, telefono, label = 'Inscribirme ahora' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`${styles.wrap} ${visible ? styles.visible : ''}`}>
      <a
        href={href ?? '#'}
        target="_blank"
        rel="noreferrer"
        className={styles.btn}
      >
        <Phone size={18} strokeWidth={2} />
        <span>{label}</span>
        {telefono && <span className={styles.tel}>{telefono}</span>}
      </a>
    </div>
  )
}
