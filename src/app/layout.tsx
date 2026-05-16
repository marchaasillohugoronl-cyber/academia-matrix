import type { Metadata } from 'next'
import '../estilos/globales.css'
import { Providers }       from './providers'
import BarraNavegacion     from '@/componentes/BarraNavegacion'
import PiePagina           from '@/componentes/PiePagina'
import LineaEscaneo        from '@/componentes/LineaEscaneo'
import Particulas          from '@/componentes/Particulas'
import DesplazarseArriba   from '@/paginas/niveles/DesplazarseArriba'
import { db }              from '@/lib/db'
import { configuracion }   from '@/lib/db/schema'
import { configToObject }  from '@/lib/sitio-util'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Academia de Matemáticas MATRIX',
  description: 'Preparación intensiva en matemáticas para primaria, secundaria y preuniversitario en Cabanillas, Perú.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let sitio: Record<string, string> = {}
  try {
    const rows = await db.select().from(configuracion)
    sitio = configToObject(rows)
  } catch {
    // DATABASE_URL no configurada (ej. durante build local sin BD)
  }

  return (
    <html lang="es">
      <body>
        <Providers>
          <LineaEscaneo />
          <Particulas />
          <DesplazarseArriba />
          <BarraNavegacion sitio={sitio} />
          {children}
          <PiePagina sitio={sitio} />
        </Providers>
      </body>
    </html>
  )
}
