'use client'
import { useState } from 'react'
import { signIn }   from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function FormularioLogin() {
  const router   = useRouter()
  const [error,   setError]   = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const res  = await signIn('credentials', {
      email:    form.get('email'),
      password: form.get('password'),
      redirect: false,
    })

    if (res?.error) {
      setError('Email o contraseña incorrectos')
      setCargando(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={styles.input}
          placeholder="admin@academiamatrix.com"
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={styles.input}
          placeholder="••••••••"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" disabled={cargando} className={styles.btnEntrar}>
        {cargando ? 'Verificando...' : 'Entrar al panel'}
      </button>
    </form>
  )
}
