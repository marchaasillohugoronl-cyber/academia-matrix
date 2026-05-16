import { db }     from '@/lib/db'
import { ciclos } from '@/lib/db/schema'
import { eq }     from 'drizzle-orm'
import { auth }   from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id }  = await params
  const [ciclo] = await db.select().from(ciclos).where(eq(ciclos.id, id))
  if (!ciclo) return Response.json({ error: 'No encontrado' }, { status: 404 })
  return Response.json(ciclo)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return Response.json({ error: 'No autorizado' }, { status: 401 })

  const { id }  = await params
  const body    = await req.json()

  // Solo campos editables
  const {
    nombre, etiqueta, descripcion, precio, etiquetaPrecio, subPrecio,
    duracion, totalHoras, inicioInscripcion, finInscripcion, inicioClases,
    turnos, estadisticas, niveles, activo,
  } = body

  await db.update(ciclos).set({
    nombre, etiqueta, descripcion, precio, etiquetaPrecio, subPrecio,
    duracion, totalHoras, inicioInscripcion, finInscripcion, inicioClases,
    turnos: turnos ?? null,
    estadisticas: estadisticas ?? null,
    niveles: niveles ?? null,
    activo,
    updatedAt: new Date(),
  }).where(eq(ciclos.id, id))

  return Response.json({ ok: true })
}
