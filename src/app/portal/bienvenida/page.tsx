import { getAlumnoSesion } from '@/lib/portal-session'
import { redirect }        from 'next/navigation'
import PaginaBienvenida    from './PaginaBienvenida'

export const dynamic = 'force-dynamic'

export default async function Bienvenida() {
  const alumno = await getAlumnoSesion()
  if (!alumno) redirect('/portal')
  if (alumno.aceptoTerminos) redirect('/portal/dashboard')

  return <PaginaBienvenida nombre={alumno.nombre} emailAcademia={alumno.emailAcademia} />
}
