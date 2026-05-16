import { db }                        from '@/lib/db'
import { alumnos, ciclos, niveles }  from '@/lib/db/schema'
import TablaAlumnos                  from './TablaAlumnos'

export const dynamic = 'force-dynamic'

export default async function PaginaAlumnos() {
  const [listaAlumnos, listaCiclos, listaNiveles] = await Promise.all([
    db.select({
      id:              alumnos.id,
      dni:             alumnos.dni,
      nombre:          alumnos.nombre,
      apellidos:       alumnos.apellidos,
      fechaNacimiento: alumnos.fechaNacimiento,
      telefono:        alumnos.telefono,
      emailAcademia:      alumnos.emailAcademia,
      emailPersonal:      alumnos.emailPersonal,
      tienePassword:      alumnos.passwordHash,
      direccion:          alumnos.direccion,
      apoderado:          alumnos.apoderado,
      telefonoApoderado:  alumnos.telefonoApoderado,
      cicloId:            alumnos.cicloId,
      nivelId:         alumnos.nivelId,
      activo:          alumnos.activo,
      registradoEn:    alumnos.registradoEn,
    }).from(alumnos).orderBy(alumnos.registradoEn),
    db.select({ id: ciclos.id, nombre: ciclos.nombre }).from(ciclos),
    db.select({ id: niveles.id, nombre: niveles.nombre }).from(niveles),
  ])

  return (
    <TablaAlumnos
      alumnos={listaAlumnos}
      ciclos={listaCiclos}
      niveles={listaNiveles}
    />
  )
}
