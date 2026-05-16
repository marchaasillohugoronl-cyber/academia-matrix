import { db }                                    from '@/lib/db'
import { ciclos, niveles, cursos, configuracion } from '@/lib/db/schema'
import { eq }                                     from 'drizzle-orm'
import { notFound }                               from 'next/navigation'
import { configToObject }                         from '@/lib/sitio-util'
import PaginaCursosNivel                          from '@/paginas/niveles/PaginaCursosNivel'

export const dynamic = 'force-dynamic'

export default async function NivelPage({
  params,
}: {
  params: Promise<{ cicloId: string; nivelId: string }>
}) {
  const { cicloId, nivelId } = await params

  const [ciclosData, nivelesData, cursosData, configRows] = await Promise.all([
    db.select().from(ciclos).where(eq(ciclos.id, cicloId)),
    db.select().from(niveles).where(eq(niveles.id, nivelId)),
    db.select().from(cursos).where(eq(cursos.nivelId, nivelId)).orderBy(cursos.orden),
    db.select().from(configuracion),
  ])

  const ciclo = ciclosData[0]
  const nivel = nivelesData[0]
  if (!ciclo || !nivel) notFound()

  const sitio = configToObject(configRows)

  return (
    <PaginaCursosNivel
      ciclo={ciclo}
      nivel={nivel}
      cursos={cursosData}
      sitio={sitio}
    />
  )
}
