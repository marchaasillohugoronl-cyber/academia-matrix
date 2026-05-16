import { getAlumnoSesion } from '@/lib/portal-session'
import { redirect }        from 'next/navigation'
import { db }              from '@/lib/db'
import { ciclos, niveles } from '@/lib/db/schema'
import FormPerfil          from './FormPerfil'

export const dynamic = 'force-dynamic'

export default async function PaginaPerfil() {
  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')
  if (!alumno.aceptoTerminos) redirect('/portal/bienvenida')

  const [listaCiclos, listaNiveles] = await Promise.all([
    db.select().from(ciclos),
    db.select().from(niveles),
  ])

  const cicloNombre = listaCiclos.find((c) => c.id === alumno.cicloId)?.nombre ?? '—'
  const nivelNombre = listaNiveles.find((n) => n.id === alumno.nivelId)?.nombre ?? '—'

  return (
    <FormPerfil
      alumno={{
        nombre:               alumno.nombre,
        apellidos:            alumno.apellidos,
        dni:                  alumno.dni,
        fechaNacimiento:      alumno.fechaNacimiento,
        telefono:             alumno.telefono,
        emailAcademia:        alumno.emailAcademia,
        emailPersonal:        alumno.emailPersonal,
        direccion:            alumno.direccion ?? null,
        apoderado:            alumno.apoderado ?? null,
        telefonoApoderado:    alumno.telefonoApoderado ?? null,
        fotoUrl:              alumno.fotoUrl ?? null,
        cicloNombre,
        nivelNombre,
        aceptoNotificaciones: alumno.aceptoNotificaciones ?? false,
        tienePassword:        !!alumno.passwordHash,
      }}
    />
  )
}
