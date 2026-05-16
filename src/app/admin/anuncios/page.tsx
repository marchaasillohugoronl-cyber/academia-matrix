import { db }       from '@/lib/db'
import { anuncios } from '@/lib/db/schema'
import { desc }     from 'drizzle-orm'
import GestorAnuncios from './GestorAnuncios'

export const dynamic = 'force-dynamic'

export default async function PaginaAnuncios() {
  const lista = await db.select().from(anuncios).orderBy(desc(anuncios.creadoEn))
  return <GestorAnuncios lista={lista} />
}
