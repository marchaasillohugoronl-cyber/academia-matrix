import { db }     from '@/lib/db'
import { cursos } from '@/lib/db/schema'
import { eq }     from 'drizzle-orm'
import { auth }   from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ nivelId: string }> }
) {
  const { nivelId } = await params
  const data = await db
    .select()
    .from(cursos)
    .where(eq(cursos.nivelId, nivelId))
    .orderBy(cursos.orden)
  return Response.json(data)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ nivelId: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'No autorizado' }, { status: 401 })

  const { nivelId } = await params
  const lista: { nombre: string; icono: string; orden: number }[] = await req.json()

  // Reemplazar todos los cursos del nivel
  await db.delete(cursos).where(eq(cursos.nivelId, nivelId))
  if (lista.length > 0) {
    await db.insert(cursos).values(lista.map((c) => ({ ...c, nivelId })))
  }

  return Response.json({ ok: true })
}
