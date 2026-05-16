'use client'
import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Megaphone, BookOpen, ClipboardList, Users } from 'lucide-react'
import styles from './admin.module.css'

const ITEMS = [
  { href: '/admin',           label: 'Inicio',    Icon: LayoutDashboard },
  { href: '/admin/alumnos',   label: 'Alumnos',   Icon: Users           },
  { href: '/admin/anuncios',  label: 'Anuncios',  Icon: Megaphone       },
  { href: '/admin/examenes',  label: 'Exámenes',  Icon: BookOpen        },
  { href: '/admin/encuestas', label: 'Encuestas', Icon: ClipboardList   },
]

export default function BottomNavAdmin() {
  const pathname = usePathname()

  return (
    <nav className={styles.bottomNav}>
      {ITEMS.map(({ href, label, Icon }) => {
        const activo = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.bottomNavItem} ${activo ? styles.bottomNavActivo : ''}`}
          >
            <Icon size={20} strokeWidth={activo ? 2 : 1.5} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
