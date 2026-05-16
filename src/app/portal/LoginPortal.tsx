'use client'
import { useActionState } from 'react'
import { useFormStatus }  from 'react-dom'
import Link from 'next/link'
import { AlertCircle, Loader2 } from 'lucide-react'
import { loginPortal, type ErrorLogin } from './actions'
import styles from './portal.module.css'

function BtnEntrar() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={styles.btnSubmit}>
      {pending
        ? <><Loader2 size={16} className={styles.spin} /> Verificando…</>
        : 'Ingresar al portal'}
    </button>
  )
}

export default function LoginPortal() {
  const [error, accion] = useActionState<ErrorLogin, FormData>(loginPortal, null)

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.badge}>Portal del alumno</div>
          <h1 className={styles.titulo}>Ingresa a tu portal</h1>
          <p className={styles.sub}>
            Accede con tu DNI y fecha de nacimiento para ver anuncios, exámenes y más.
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form action={accion} className={styles.form} noValidate>
          <div className={styles.campo}>
            <label htmlFor="email">Correo institucional</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tunombre@academiamatrix.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <BtnEntrar />
        </form>

        <p className={styles.pie}>
          ¿Aún no tienes cuenta?{' '}
          <Link href="/registro" className={styles.pieLlink}>Regístrate aquí</Link>
        </p>
        <p className={styles.pie}>
          ¿Olvidaste tu contraseña? Comunícate con la academia.
        </p>
      </div>
    </div>
  )
}
