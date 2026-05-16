import { db }     from '@/lib/db'
import { ciclos } from '@/lib/db/schema'
import PaginaCiclos from '@/paginas/ciclos/PaginaCiclos'

export const dynamic = 'force-dynamic'

export default async function CiclosPage() {
  const data = await db.select().from(ciclos)
  return <PaginaCiclos ciclos={data} />
}
