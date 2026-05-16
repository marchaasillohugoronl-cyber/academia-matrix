import { db }                                           from '@/lib/db'
import { ciclos, niveles, cursos, configuracion }        from '@/lib/db/schema'
import { eq }                                            from 'drizzle-orm'
import { notFound }                                      from 'next/navigation'
import { configToObject }                                from '@/lib/sitio-util'
import PaginaDetalleCiclo                                from '@/paginas/ciclos/PaginaDetalleCiclo'
import type { Curso }                                    from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export default async function DetalleCicloPage({
  params,
}: {
  params: Promise<{ cicloId: string }>
}) {
  const { cicloId } = await params

  const [ciclosData, nivelesData, cursosData, configRows] = await Promise.all([
    db.select().from(ciclos).where(eq(ciclos.id, cicloId)),
    db.select().from(niveles).orderBy(niveles.orden),
    db.select().from(cursos),
    db.select().from(configuracion),
  ])

  const ciclo = ciclosData[0]
  if (!ciclo) notFound()

  const cursosPorNivel: Record<string, Curso[]> = {}
  for (const c of cursosData) {
    if (c.nivelId) {
      cursosPorNivel[c.nivelId] = [...(cursosPorNivel[c.nivelId] ?? []), c]
    }
  }

  const sitio = configToObject(configRows)

  return (
    <PaginaDetalleCiclo
      ciclo={ciclo}
      niveles={nivelesData}
      cursos={cursosPorNivel}
      sitio={sitio}
    />
  )
}
