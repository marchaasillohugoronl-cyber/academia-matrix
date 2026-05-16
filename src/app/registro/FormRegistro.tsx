'use client'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus }  from 'react-dom'
import { useRouter }      from 'next/navigation'
import Link               from 'next/link'
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, KeyRound, Copy } from 'lucide-react'
import { registrarAlumno, type ResultadoRegistro } from './actions'
import styles from './registro.module.css'

type Props = {
  ciclos:  { id: string; nombre: string }[]
  niveles: { id: string; nombre: string; orden: number | null }[]
}

function BotonEnviar() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={styles.btnSubmit}>
      {pending
        ? <><Loader2 size={16} className={styles.spin} /> Creando cuenta…</>
        : 'Crear mi cuenta'}
    </button>
  )
}

function PantallaExito({ nombre, email }: { nombre: string; email: string }) {
  const router    = useRouter()
  const [seg, setSeg] = useState(5)

  useEffect(() => {
    if (seg <= 0) { router.push('/portal'); return }
    const t = setTimeout(() => setSeg((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seg, router])

  function copiar() {
    navigator.clipboard.writeText(email).catch(() => {})
  }

  return (
    <div className={styles.exitoOverlay}>
      <div className={styles.exito}>
        <CheckCircle size={52} className={styles.exitoIcono} />
        <h2 className={styles.exitoTitulo}>¡Cuenta creada!</h2>
        <p className={styles.exitoSub}>
          Bienvenido, <strong>{nombre}</strong>. Tu cuenta en Academia MATRIX está lista.
        </p>

        <div className={styles.credencialesBox}>
          <p className={styles.credencialesLabel}>Tu correo institucional</p>
          <div className={styles.emailRow}>
            <span className={styles.emailValor}>{email}</span>
            <button className={styles.btnCopiar} onClick={copiar} type="button" title="Copiar correo">
              <Copy size={14} />
            </button>
          </div>
          <p className={styles.credencialesSub}>
            Usa este correo y la contraseña que elegiste para ingresar al portal.
          </p>
        </div>

        <p className={styles.redireccionando}>
          Redirigiendo al portal en <strong>{seg}s</strong>…
        </p>

        <Link href="/portal" className={styles.btnPortal}>
          Ir al portal ahora
        </Link>
      </div>
    </div>
  )
}

export default function FormRegistro({ ciclos, niveles }: Props) {
  const [estado, accion] = useActionState<ResultadoRegistro | null, FormData>(
    registrarAlumno,
    null,
  )

  if (estado?.ok) {
    return <PantallaExito nombre={estado.nombre} email={estado.emailAcademia} />
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Cabecera */}
        <div className={styles.cardHead}>
          <Link href="/" className={styles.linkVolver}>
            <ArrowLeft size={14} /> Volver
          </Link>
          <div className={styles.badge}>Inscripción</div>
          <h1 className={styles.titulo}>Crea tu cuenta</h1>
          <p className={styles.sub}>
            Completa tus datos para inscribirte en Academia MATRIX.
            Al terminar recibirás tu correo institucional y podrás acceder al portal.
          </p>
        </div>

        {/* Error */}
        {estado && !estado.ok && (
          <div className={styles.error}>
            <AlertCircle size={16} />
            <span>{estado.error}</span>
          </div>
        )}

        <form action={accion} className={styles.form} noValidate>

          {/* Datos personales */}
          <fieldset className={styles.grupo}>
            <legend className={styles.grupoLabel}>Datos personales</legend>

            <div className={styles.fila2}>
              <div className={styles.campo}>
                <label htmlFor="nombre">Nombres</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ej: Juan Carlos"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className={styles.campo}>
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  placeholder="Ej: Mamani Quispe"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div className={styles.fila2}>
              <div className={styles.campo}>
                <label htmlFor="dni">DNI</label>
                <input
                  id="dni"
                  name="dni"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  pattern="\d{8}"
                  placeholder="12345678"
                  required
                />
              </div>
              <div className={styles.campo}>
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  required
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label htmlFor="telefono">Teléfono / WhatsApp</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                inputMode="numeric"
                placeholder="Ej: 987654321"
                autoComplete="tel"
              />
            </div>
          </fieldset>

          {/* Datos académicos */}
          <fieldset className={styles.grupo}>
            <legend className={styles.grupoLabel}>Datos académicos</legend>

            <div className={styles.fila2}>
              <div className={styles.campo}>
                <label htmlFor="nivelId">Nivel académico</label>
                <select id="nivelId" name="nivelId" required>
                  <option value="">Selecciona tu nivel…</option>
                  {niveles.map((n) => (
                    <option key={n.id} value={n.id}>{n.nombre}</option>
                  ))}
                </select>
              </div>
              <div className={styles.campo}>
                <label htmlFor="cicloId">Ciclo de inscripción</label>
                <select id="cicloId" name="cicloId" required>
                  <option value="">Selecciona el ciclo…</option>
                  {ciclos.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Credenciales */}
          <fieldset className={styles.grupo}>
            <legend className={styles.grupoLabel}>
              <KeyRound size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              Credenciales de acceso
            </legend>

            <p className={styles.campoInfo}>
              Tu correo institucional (<strong>@academiamatrix.com</strong>) se generará
              automáticamente con tu nombre. Elige una contraseña para acceder al portal.
            </p>

            <div className={styles.campo}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                required
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                required
              />
            </div>
          </fieldset>

          <BotonEnviar />
        </form>
      </div>
    </div>
  )
}
