import type { Config } from './db/schema'

/** Convierte filas {clave, valor} a un objeto plano */
export function configToObject(rows: Config[]): Record<string, string> {
  return Object.fromEntries(rows.map((r) => [r.clave, r.valor ?? '']))
}
