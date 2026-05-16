import { db }     from '@/lib/db'
import { ciclos } from '@/lib/db/schema'

export async function GET() {
  const data = await db.select().from(ciclos)
  return Response.json(data)
}
