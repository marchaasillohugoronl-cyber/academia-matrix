import Link from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import styles from '../../prueba.module.css'

export default function EncuestaOk() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarLogo}>
          <span className={styles.topbarMarca}>MATRIX</span>
          <span className={styles.topbarSub}>Portal del alumno</span>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.okPage}>
          <div className={styles.okIcono}><CheckCircle2 size={36} /></div>
          <h1 className={styles.okTitle}>¡Gracias por responder!</h1>
          <p className={styles.okSub}>
            Tu opinión fue registrada. Tus respuestas nos ayudan a mejorar la
            calidad de la enseñanza en Academia MATRIX.
          </p>
          <Link href="/portal/dashboard" className={styles.okLink}>
            <ArrowLeft size={13} /> Volver al dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
