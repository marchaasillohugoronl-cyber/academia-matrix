import { db }                    from '@/lib/db'
import { configuracion }         from '@/lib/db/schema'
import { configToObject }        from '@/lib/sitio-util'
import Portada                   from '@/componentes/Portada'
import SeccionNiveles            from '@/componentes/SeccionNiveles'
import SeccionCaracteristicas    from '@/componentes/SeccionCaracteristicas'
import SeccionLlamada            from '@/componentes/SeccionLlamada'

export const dynamic = 'force-dynamic'

export default async function PaginaInicio() {
  const configRows = await db.select().from(configuracion)
  const sitio      = configToObject(configRows)

  return (
    <main>
      <Portada />
      <div className="divisor" />
      <SeccionNiveles />
      <div className="divisor" />
      <SeccionCaracteristicas />
      <div className="divisor" />
      <SeccionLlamada sitio={sitio} />
    </main>
  )
}
