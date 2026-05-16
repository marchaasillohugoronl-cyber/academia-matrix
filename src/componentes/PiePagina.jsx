'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link           from 'next/link'
import { Phone, Home, Lock } from 'lucide-react'
import styles from './PiePagina.module.css'

export default function PiePagina({ sitio }) {
  const navegar  = useRouter()
  const pathname = usePathname()

  if (pathname.startsWith('/admin') || pathname === '/login' || pathname.startsWith('/portal')) return null

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>{sitio?.nombreCorto ?? 'MATRIX'}</div>
          <p className={styles.tagline}>Academia de Matemáticas</p>
        </div>

        <div className={styles.info}>
          <p className={styles.address}>{sitio?.ubicacion ?? ''}</p>
          <a href={`tel:${sitio?.telefono ?? ''}`} className={styles.phone}>
            <Phone size={16} />
            <span>{sitio?.telefono ?? ''}</span>
          </a>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.footerHomeBtn}
            onClick={() => {
              navegar.push('/')
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)
            }}
          >
            <Home size={16} />
            <span>Volver Inicio</span>
          </button>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} {sitio?.nombreCorto ?? 'MATRIX'} · Todos los derechos reservados</span>

        <Link href="/login" className={styles.adminLink}>
          <Lock size={12} />
          <span>Admin</span>
        </Link>
      </div>
    </footer>
  )
}
