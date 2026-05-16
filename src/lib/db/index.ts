import { neon }    from '@neondatabase/serverless'
import { drizzle }  from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Inicialización lazy: se crea la conexión solo cuando se hace la primera query.
// Esto permite que el build de Next.js funcione sin DATABASE_URL configurada.
let _db: NeonHttpDatabase<typeof schema> | undefined

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL no está configurada. Revisa tus variables de entorno.')
    _db = drizzle(neon(url), { schema })
  }
  return _db
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop)
  },
})

export * from './schema'
