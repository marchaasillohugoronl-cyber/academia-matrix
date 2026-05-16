import { getAlumnoSesion } from '@/lib/portal-session'
import { redirect }        from 'next/navigation'
import LoginPortal         from './LoginPortal'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Portal del Alumno — Academia MATRIX' }

export default async function PaginaPortal() {
  const alumno = await getAlumnoSesion()
  if (alumno) redirect('/portal/dashboard')
  return <LoginPortal />
}
