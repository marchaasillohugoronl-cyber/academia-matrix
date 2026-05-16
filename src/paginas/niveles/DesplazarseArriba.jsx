'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function DesplazarseArriba() {
  const rutaActual = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [rutaActual])

  return null
}
