'use client'
import { useActionState } from 'react'
import { useFormStatus }  from 'react-dom'
import { aceptarPoliticas, type ResultadoPoliticas } from '../actions'
import { AlertCircle, CheckCircle2, Loader2, BookOpen, Mail } from 'lucide-react'
import styles from './bienvenida.module.css'

function BtnAceptar() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={styles.btnAceptar}>
      {pending
        ? <><Loader2 size={16} className={styles.spin}/> Guardando…</>
        : <><CheckCircle2 size={16}/> Acepto y continuar al portal</>}
    </button>
  )
}

export default function PaginaBienvenida({
  nombre,
  emailAcademia,
}: {
  nombre: string
  emailAcademia: string | null
}) {
  const [resultado, accion] = useActionState<ResultadoPoliticas | null, FormData>(
    aceptarPoliticas,
    null,
  )

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Cabecera */}
        <div className={styles.head}>
          <div className={styles.badge}>Academia MATRIX</div>
          <h1 className={styles.titulo}>¡Bienvenido, {nombre}!</h1>
          <p className={styles.sub}>
            Antes de continuar, lee nuestra política de uso y acepta los términos.
          </p>
        </div>

        {/* Correo asignado */}
        {emailAcademia && (
          <div className={styles.emailCard}>
            <Mail size={16} className={styles.emailIcono}/>
            <div>
              <p className={styles.emailLabel}>Tu correo de la academia</p>
              <p className={styles.emailValor}>{emailAcademia}</p>
            </div>
          </div>
        )}

        {/* Política de uso */}
        <div className={styles.politica}>
          <div className={styles.politicaHead}>
            <BookOpen size={15}/>
            <span>Política de Uso del Portal Académico</span>
          </div>
          <div className={styles.politicaTexto}>
            <p>
              <strong>Academia MATRIX</strong> cree en el <strong>libre acceso al conocimiento</strong>{' '}
              como herramienta fundamental para asegurar un futuro mejor a los jóvenes de nuestra
              comunidad. Este portal es un espacio exclusivo para alumnos activos, diseñado para
              facilitar su aprendizaje y desarrollo académico.
            </p>
            <p>Al ingresar al portal, el alumno se compromete a:</p>
            <ul>
              <li>Usar la plataforma únicamente con fines educativos y de aprendizaje personal.</li>
              <li>No compartir sus credenciales de acceso con terceros.</li>
              <li>Respetar los contenidos, exámenes y encuestas disponibles, respondiendo con honestidad.</li>
              <li>Tratar con respeto los recursos digitales de la academia.</li>
              <li>No reproducir, distribuir ni comercializar los materiales del portal sin autorización expresa.</li>
            </ul>
            <p>
              La academia se compromete a proteger los datos personales del alumno conforme a la
              Ley N° 29733 — Ley de Protección de Datos Personales del Perú — y a utilizarlos
              exclusivamente para la gestión académica.
            </p>
            <p>
              El incumplimiento de estas políticas puede resultar en la suspensión del acceso al portal.
            </p>
          </div>
        </div>

        {/* Error */}
        {resultado && !resultado.ok && (
          <div className={styles.error}>
            <AlertCircle size={15}/>
            <span>{resultado.error}</span>
          </div>
        )}

        {/* Formulario de aceptación */}
        <form action={accion} className={styles.form}>
          <label className={styles.checkLabel}>
            <input type="checkbox" name="terminos" className={styles.check} required/>
            <span>
              He leído y acepto los <strong>Términos y Condiciones</strong> de uso del
              portal académico de Academia MATRIX.
            </span>
          </label>

          <label className={styles.checkLabel}>
            <input type="checkbox" name="notificaciones" className={styles.check}/>
            <span>
              Deseo recibir <strong>notificaciones</strong> sobre nuevos anuncios,
              exámenes y encuestas por correo electrónico.
            </span>
          </label>

          <BtnAceptar/>
        </form>

      </div>
    </div>
  )
}
