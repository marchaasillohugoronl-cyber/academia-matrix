'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus }   from 'react-dom'
import { useRouter }       from 'next/navigation'
import Image               from 'next/image'
import Link                from 'next/link'
import { actualizarPerfil, type ResultadoPerfil } from './actions'
import { subirFoto, type ResultadoFoto } from './foto-action'
import {
  AlertCircle, CheckCircle2, Loader2, ArrowLeft,
  Mail, Phone, User, Hash, GraduationCap, KeyRound,
  MapPin, Calendar, Users, Camera,
} from 'lucide-react'
import styles from './perfil.module.css'

type Props = {
  alumno: {
    nombre: string; apellidos: string; dni: string
    fechaNacimiento: string
    emailAcademia: string | null; emailPersonal: string | null
    telefono: string | null
    direccion: string | null; apoderado: string | null; telefonoApoderado: string | null
    fotoUrl: string | null
    cicloNombre: string; nivelNombre: string
    aceptoNotificaciones: boolean; tienePassword: boolean
  }
}

function BtnGuardar() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={styles.btnGuardar}>
      {pending
        ? <><Loader2 size={16} className={styles.spin}/> Guardando…</>
        : <><CheckCircle2 size={16}/> Guardar cambios</>}
    </button>
  )
}

function FotoAvatar({ inicial, fotoUrl }: { inicial: string; fotoUrl: string | null }) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const formRef   = useRef<HTMLFormElement>(null)
  const [preview, setPreview] = useState<string | null>(fotoUrl)
  const [resultado, accion, isPending] = useActionState<ResultadoFoto | null, FormData>(subirFoto, null)

  useEffect(() => {
    if (resultado?.ok === true) setPreview(resultado.url)
  }, [resultado])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    formRef.current?.requestSubmit()
  }

  return (
    <div className={styles.avatarWrap}>
      <form ref={formRef} action={accion} className={styles.avatarForm}>
        <input
          ref={inputRef}
          type="file"
          name="foto"
          accept="image/*"
          className={styles.avatarInput}
          onChange={onFileChange}
        />
        <button
          type="button"
          className={styles.avatarBtn}
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          title="Cambiar foto"
        >
          {preview
            ? <Image src={preview} alt="Foto de perfil" width={96} height={96} className={styles.avatarImg} />
            : <span className={styles.avatarIniciales}>{inicial}</span>}
          <span className={styles.avatarOverlay}>
            {isPending ? <Loader2 size={20} className={styles.spin}/> : <Camera size={20}/>}
          </span>
        </button>
      </form>
      {resultado?.ok === false && (
        <p className={styles.avatarError}>{resultado.error}</p>
      )}
    </div>
  )
}

export default function FormPerfil({ alumno }: Props) {
  const router = useRouter()
  const [resultado, accion] = useActionState<ResultadoPerfil | null, FormData>(
    actualizarPerfil,
    null,
  )

  useEffect(() => {
    if (resultado?.ok === true) router.push('/portal/dashboard')
  }, [resultado, router])

  const emailSugerido = alumno.emailAcademia ??
    `${alumno.nombre.toLowerCase().split(' ')[0]}.${alumno.apellidos.toLowerCase().split(' ')[0]}@academiamatrix.com`

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Cabecera */}
        <div className={styles.topbar}>
          <div className={styles.topbarInfo}>
            <div className={styles.badge}>Mi Perfil</div>
            <h1 className={styles.titulo}>{alumno.nombre} {alumno.apellidos}</h1>
          </div>
          <Link href="/portal/dashboard" className={styles.btnVolver}>
            <ArrowLeft size={14}/> Volver
          </Link>
        </div>

        {/* Foto de perfil */}
        <FotoAvatar
          inicial={`${alumno.nombre[0] ?? ''}${alumno.apellidos[0] ?? ''}`.toUpperCase()}
          fotoUrl={alumno.fotoUrl}
        />

        {/* Info de solo lectura */}
        <div className={styles.seccion}>
          <p className={styles.seccionLabel}>Datos académicos</p>
          <div className={styles.infoGrid}>
            <InfoCampo icon={<Hash size={14}/>}          label="DNI"    valor={alumno.dni} />
            <InfoCampo icon={<User size={14}/>}           label="Nombre" valor={`${alumno.nombre} ${alumno.apellidos}`} />
            <InfoCampo icon={<GraduationCap size={14}/>}  label="Nivel"  valor={alumno.nivelNombre} />
            <InfoCampo icon={<GraduationCap size={14}/>}  label="Ciclo"  valor={alumno.cicloNombre} />
          </div>
        </div>

        {/* Resultado */}
        {resultado?.ok === true && (
          <div className={styles.exito}>
            <CheckCircle2 size={15}/>
            <span>{resultado.mensaje}</span>
          </div>
        )}
        {resultado?.ok === false && (
          <div className={styles.error}>
            <AlertCircle size={15}/>
            <span>{resultado.error}</span>
          </div>
        )}

        <form action={accion} className={styles.form}>

          {/* ── Datos personales ── */}
          <p className={styles.seccionLabel}>Datos personales</p>

          <div className={styles.grid2}>
            <div className={styles.campo}>
              <label htmlFor="nombre"><User size={13}/> Nombres *</label>
              <input
                id="nombre" name="nombre"
                defaultValue={alumno.nombre}
                required
              />
            </div>
            <div className={styles.campo}>
              <label htmlFor="apellidos"><User size={13}/> Apellidos *</label>
              <input
                id="apellidos" name="apellidos"
                defaultValue={alumno.apellidos}
                required
              />
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="fechaNacimiento"><Calendar size={13}/> Fecha de nacimiento *</label>
            <input
              id="fechaNacimiento" name="fechaNacimiento"
              type="date"
              defaultValue={alumno.fechaNacimiento}
              required
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="direccion"><MapPin size={13}/> Dirección</label>
            <input
              id="direccion" name="direccion"
              defaultValue={alumno.direccion ?? ''}
              placeholder="Jr. Ejemplo 123, Cabanillas"
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.campo}>
              <label htmlFor="apoderado"><Users size={13}/> Apoderado / Tutor</label>
              <input
                id="apoderado" name="apoderado"
                defaultValue={alumno.apoderado ?? ''}
                placeholder="Nombre completo"
              />
            </div>
            <div className={styles.campo}>
              <label htmlFor="telefonoApoderado"><Phone size={13}/> Teléfono apoderado</label>
              <input
                id="telefonoApoderado" name="telefonoApoderado"
                type="tel"
                defaultValue={alumno.telefonoApoderado ?? ''}
                placeholder="987654321"
              />
            </div>
          </div>

          {/* ── Credenciales de acceso ── */}
          <p className={styles.seccionLabel} style={{ marginTop: 8 }}>Credenciales de acceso</p>

          <div className={styles.campo}>
            <label htmlFor="emailAcademia">
              <Mail size={13}/> Correo institucional
            </label>
            <input
              id="emailAcademia"
              name="emailAcademia"
              type="email"
              defaultValue={emailSugerido}
              placeholder="tunombre@academiamatrix.com"
              autoComplete="username"
            />
            <span className={styles.campoHint}>
              Debe terminar en @academiamatrix.com · lo usas para iniciar sesión
            </span>
          </div>

          <div className={styles.campo}>
            <label htmlFor="nuevaPassword">
              <KeyRound size={13}/> {alumno.tienePassword ? 'Nueva contraseña' : 'Crear contraseña'}
            </label>
            <input
              id="nuevaPassword"
              name="nuevaPassword"
              type="password"
              placeholder={alumno.tienePassword ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
              autoComplete="new-password"
            />
          </div>

          {/* Confirmar solo si tienen intención de cambiar */}
          <div className={styles.campo}>
            <label htmlFor="confirmarPassword">
              <KeyRound size={13}/> Confirmar contraseña
            </label>
            <input
              id="confirmarPassword"
              name="confirmarPassword"
              type="password"
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
            />
          </div>

          {/* ── Datos de contacto ── */}
          <p className={styles.seccionLabel} style={{ marginTop: 8 }}>Datos de contacto</p>

          <div className={styles.campo}>
            <label htmlFor="telefono">
              <Phone size={13}/> Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              defaultValue={alumno.telefono ?? ''}
              placeholder="Ej: 987654321"
              autoComplete="tel"
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="emailPersonal">
              <Mail size={13}/> Correo personal
            </label>
            <input
              id="emailPersonal"
              name="emailPersonal"
              type="email"
              defaultValue={alumno.emailPersonal ?? ''}
              placeholder="ejemplo@gmail.com"
              autoComplete="email"
            />
          </div>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              name="notificaciones"
              className={styles.check}
              defaultChecked={alumno.aceptoNotificaciones}
            />
            <span>
              Recibir <strong>notificaciones</strong> de anuncios, exámenes y encuestas.
            </span>
          </label>
          <BtnGuardar/>
                      <button
              type="button"
              onClick={() => router.push('/portal/dashboard')}
              className={styles.btnDashboard}
            >
              <ArrowLeft size={16}/>
              Volver
            </button>
        </form>

      </div>
    </div>
  )
}

function InfoCampo({
  icon, label, valor, full,
}: {
  icon: React.ReactNode; label: string; valor: string; full?: boolean
}) {
  return (
    <div className={`${styles.infoItem} ${full ? styles.infoItemFull : ''}`}>
      <span className={styles.infoIcono}>{icon}</span>
      <div>
        <p className={styles.infoLabel}>{label}</p>
        <p className={styles.infoValor}>{valor}</p>
      </div>
    </div>
  )
}
