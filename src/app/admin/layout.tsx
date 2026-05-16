import { auth, signOut }  from '@/lib/auth'
import { redirect }       from 'next/navigation'
import BottomNavAdmin     from './BottomNavAdmin'
import TopNavAdmin        from './TopNavAdmin'
import styles from './admin.module.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className={styles.adminWrap}>
      <header className={styles.topbar}>
        <div className={styles.topbarLogo}>
          <span className={styles.topbarLogoMarca}>MATRIX</span>
          <span className={styles.topbarLogoBadge}>ADMIN</span>
        </div>

        <TopNavAdmin />

        <div className={styles.topbarRight}>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
            <button type="submit" className={styles.btnSalir}>Cerrar sesión</button>
          </form>
        </div>

        <form
          className={styles.btnSalirMobile}
          action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}
        >
          <button type="submit" className={styles.btnSalir}>Salir</button>
        </form>
      </header>

      <main className={styles.adminMain}>
        {children}
      </main>

      <BottomNavAdmin />
    </div>
  )
}
