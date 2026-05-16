'use client'
import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './admin.module.css'

const LINKS = [
  { href: '/admin',               label: 'Dashboard' },
  { href: '/admin/alumnos',       label: 'Alumnos'   },
  { href: '/admin/anuncios',      label: 'Anuncios'  },
  { href: '/admin/examenes',      label: 'Exámenes'  },
  { href: '/admin/encuestas',     label: 'Encuestas' },
  { href: '/admin/ciclos',        label: 'Ciclos'    },
  { href: '/admin/configuracion', label: 'Config'    },
]

export default function TopNavAdmin() {
  const pathname = usePathname()
  return (
    <nav className={styles.topbarNav}>
      {LINKS.map(({ href, label }) => {
        const activo = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${activo ? styles.navLinkActivo : ''}`}
          >
            {label}
          </Link>
        )
      })}
      <a href="/" target="_blank" rel="noreferrer" className={styles.navLink}>
        Ver web →
      </a>
    </nav>
  )
}
