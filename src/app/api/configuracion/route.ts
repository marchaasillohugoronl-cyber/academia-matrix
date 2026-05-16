import { db }            from '@/lib/db'
import { configuracion } from '@/lib/db/schema'
import { auth }          from '@/lib/auth'

export async function GET() {
  const data = await db.select().from(configuracion)
  return Response.json(Object.fromEntries(data.map((r) => [r.clave, r.valor ?? ''])))
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'No autorizado' }, { status: 401 })

  const body: Record<string, string> = await req.json()

  await Promise.all(
    Object.entries(body).map(([clave, valor]) =>
      db.insert(configuracion)
        .values({ clave, valor })
        .onConflictDoUpdate({ target: configuracion.clave, set: { valor } })
    )
  )

  return Response.json({ ok: true })
}
