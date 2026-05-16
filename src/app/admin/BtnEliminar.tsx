'use client'
import { Trash2 } from 'lucide-react'

interface Props {
  action:    () => Promise<void>
  mensaje?:  string
  className: string
  size?:     number
}

export default function BtnEliminar({ action, mensaje = '¿Eliminar?', className, size = 16 }: Props) {
  return (
    <form action={action}>
      <button
        type="submit"
        title="Eliminar"
        className={className}
        onClick={(ev) => { if (!confirm(mensaje)) ev.preventDefault() }}
      >
        <Trash2 size={size} />
      </button>
    </form>
  )
}
