import { db }             from '@/lib/db'
import { ciclos, niveles } from '@/lib/db/schema'
import { eq }              from 'drizzle-orm'
import FormRegistro        from './FormRegistro'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Registro de Alumno — Academia MATRIX' }

export default async function PaginaRegistro() {
  const [listaCiclos, listaNiveles] = await Promise.all([
    db.select({ id: ciclos.id, nombre: ciclos.nombre })
      .from(ciclos)
      .where(eq(ciclos.activo, true)),
    db.select({ id: niveles.id, nombre: niveles.nombre, orden: niveles.orden })
      .from(niveles)
      .orderBy(niveles.orden),
  ])

  return <FormRegistro ciclos={listaCiclos} niveles={listaNiveles} />
}
