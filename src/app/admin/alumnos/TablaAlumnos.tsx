'use client'
import { useState, useMemo, useActionState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import {
  Search, Users, Download, KeyRound, X, CheckCircle,
  Pencil, Trash2, AlertTriangle,
} from 'lucide-react'
import { guardarCredencialesAlumno, editarAlumno, eliminarAlumno } from './actions'
import styles from './alumnos.module.css'

type Alumno = {
  id: string
  dni: string
  nombre: string
  apellidos: string
  fechaNacimiento: string
  telefono: string | null
  emailAcademia: string | null
  emailPersonal: string | null
  tienePassword: string | null
  direccion: string | null
  apoderado: string | null
  telefonoApoderado: string | null
  cicloId: string | null
  nivelId: string | null
  activo: boolean | null
  registradoEn: Date | null
}

type Props = {
  alumnos: Alumno[]
  ciclos:  { id: string; nombre: string }[]
  niveles: { id: string; nombre: string }[]
}

function formatFecha(fecha: string | null) {
  if (!fecha) return '—'
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}
function formatRegistro(fecha: Date | null) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ── Botón submit genérico ── */
function BtnSubmit({ label, labelPending }: { label: string; labelPending: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={styles.btnGuardar}>
      {pending ? labelPending : label}
    </button>
  )
}

/* ══════════════════════════════════════════════
   MODAL CREDENCIALES
══════════════════════════════════════════════ */
function ModalCredenciales({ alumno, onClose }: { alumno: Alumno; onClose: () => void }) {
  const [resultado, accion] = useActionState(guardarCredencialesAlumno, null)
  const emailSugerido = alumno.emailAcademia ??
    `${alumno.nombre.toLowerCase().split(' ')[0]}.${alumno.apellidos.toLowerCase().split(' ')[0]}@academiamatrix.com`

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <div className={styles.modalTitulo}><KeyRound size={16} /> Credenciales de acceso</div>
          <button className={styles.modalCerrar} onClick={onClose}><X size={18} /></button>
        </div>
        <p className={styles.modalSub}><strong>{alumno.apellidos}, {alumno.nombre}</strong> · DNI {alumno.dni}</p>

        {resultado?.ok === true  && <div className={styles.modalOk}><CheckCircle size={14} /> Guardado correctamente.</div>}
        {resultado?.ok === false && <div className={styles.modalError}>{resultado.error}</div>}

        <form action={accion} className={styles.modalForm}>
          <input type="hidden" name="alumnoId" value={alumno.id} />
          <div className={styles.campo}>
            <label>Correo institucional</label>
            <input name="email" type="email" defaultValue={emailSugerido} required />
            <span className={styles.hint}>Debe terminar en @academiamatrix.com</span>
          </div>
          <div className={styles.campo}>
            <label>Contraseña{alumno.tienePassword ? ' (vacío = sin cambiar)' : ''}</label>
            <input name="password" type="password" placeholder={alumno.tienePassword ? '••••••••' : 'Mínimo 6 caracteres'} autoComplete="new-password" />
          </div>
          <BtnSubmit label="Guardar credenciales" labelPending="Guardando…" />
        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   MODAL EDICIÓN COMPLETA
══════════════════════════════════════════════ */
function ModalEditar({
  alumno, ciclos, niveles, onClose,
}: { alumno: Alumno; ciclos: Props['ciclos']; niveles: Props['niveles']; onClose: () => void }) {
  const [resultado, accion] = useActionState(editarAlumno, null)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.modalGrande}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <div className={styles.modalTitulo}><Pencil size={16} /> Editar alumno</div>
          <button className={styles.modalCerrar} onClick={onClose}><X size={18} /></button>
        </div>
        <p className={styles.modalSub}><strong>{alumno.apellidos}, {alumno.nombre}</strong> · DNI {alumno.dni}</p>

        {resultado?.ok === true  && <div className={styles.modalOk}><CheckCircle size={14} /> Cambios guardados.</div>}
        {resultado?.ok === false && <div className={styles.modalError}>{resultado.error}</div>}

        <form action={accion} className={styles.modalForm}>
          <input type="hidden" name="id" value={alumno.id} />

          {/* Datos personales */}
          <p className={styles.secLabel}>Datos personales</p>
          <div className={styles.grid2}>
            <div className={styles.campo}>
              <label>Nombres *</label>
              <input name="nombre" defaultValue={alumno.nombre} required />
            </div>
            <div className={styles.campo}>
              <label>Apellidos *</label>
              <input name="apellidos" defaultValue={alumno.apellidos} required />
            </div>
            <div className={styles.campo}>
              <label>DNI *</label>
              <input name="dni" defaultValue={alumno.dni} maxLength={8} required />
            </div>
            <div className={styles.campo}>
              <label>Fecha de nacimiento *</label>
              <input name="fechaNacimiento" type="date" defaultValue={alumno.fechaNacimiento} required />
            </div>
            <div className={styles.campo}>
              <label>Teléfono</label>
              <input name="telefono" defaultValue={alumno.telefono ?? ''} placeholder="987654321" />
            </div>
            <div className={styles.campo}>
              <label>Correo personal</label>
              <input name="emailPersonal" type="email" defaultValue={alumno.emailPersonal ?? ''} placeholder="correo@gmail.com" />
            </div>
            <div className={`${styles.campo} ${styles.span2}`}>
              <label>Dirección</label>
              <input name="direccion" defaultValue={alumno.direccion ?? ''} placeholder="Jr. Ejemplo 123, Cabanillas" />
            </div>
          </div>

          {/* Apoderado */}
          <p className={styles.secLabel}>Apoderado / Tutor</p>
          <div className={styles.grid2}>
            <div className={styles.campo}>
              <label>Nombre del apoderado</label>
              <input name="apoderado" defaultValue={alumno.apoderado ?? ''} placeholder="Nombre completo" />
            </div>
            <div className={styles.campo}>
              <label>Teléfono del apoderado</label>
              <input name="telefonoApoderado" defaultValue={alumno.telefonoApoderado ?? ''} placeholder="987654321" />
            </div>
          </div>

          {/* Datos académicos */}
          <p className={styles.secLabel}>Datos académicos</p>
          <div className={styles.grid2}>
            <div className={styles.campo}>
              <label>Ciclo</label>
              <select name="cicloId" defaultValue={alumno.cicloId ?? ''}>
                <option value="">Sin ciclo</option>
                {ciclos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className={styles.campo}>
              <label>Nivel</label>
              <select name="nivelId" defaultValue={alumno.nivelId ?? ''}>
                <option value="">Sin nivel</option>
                {niveles.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
              </select>
            </div>
            <div className={styles.campo}>
              <label>Estado</label>
              <select name="activo" defaultValue={alumno.activo ? 'true' : 'false'}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <BtnSubmit label="Guardar cambios" labelPending="Guardando…" />
        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   MODAL CONFIRMAR ELIMINACIÓN
══════════════════════════════════════════════ */
function ModalEliminar({ alumno, onClose, onConfirm, cargando }: {
  alumno: Alumno; onClose: () => void; onConfirm: () => void; cargando: boolean
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <div className={`${styles.modalTitulo} ${styles.modalTituloRojo}`}>
            <AlertTriangle size={16} /> Eliminar alumno
          </div>
          <button className={styles.modalCerrar} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.modalBody}>
          <p>¿Estás seguro de que deseas eliminar a:</p>
          <p className={styles.nombreEliminar}>{alumno.apellidos}, {alumno.nombre}</p>
          <p className={styles.dniEliminar}>DNI {alumno.dni}</p>
          <p className={styles.advertencia}>Esta acción no se puede deshacer. Se eliminarán todos sus datos.</p>
        </div>
        <div className={styles.modalAcciones}>
          <button className={styles.btnCancelar} onClick={onClose} disabled={cargando}>Cancelar</button>
          <button className={styles.btnEliminar} onClick={onConfirm} disabled={cargando}>
            {cargando ? 'Eliminando…' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   TABLA PRINCIPAL
══════════════════════════════════════════════ */
export default function TablaAlumnos({ alumnos, ciclos, niveles }: Props) {
  const [busqueda,    setBusqueda]    = useState('')
  const [filtroCiclo, setFiltroCiclo] = useState('')
  const [filtroNivel, setFiltroNivel] = useState('')
  const [modal, setModal] = useState<{ tipo: 'editar' | 'cred' | 'eliminar'; alumno: Alumno } | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return alumnos.filter((a) => {
      const coincide = !q || [a.nombre, a.apellidos, a.dni, a.telefono ?? '', a.emailAcademia ?? '']
        .some((v) => v.toLowerCase().includes(q))
      return coincide && (!filtroCiclo || a.cicloId === filtroCiclo) && (!filtroNivel || a.nivelId === filtroNivel)
    })
  }, [alumnos, busqueda, filtroCiclo, filtroNivel])

  function exportarCSV() {
    const filas = [
      ['DNI','Nombre','Apellidos','F.Nac','Teléfono','Correo academia','Dirección','Apoderado','Ciclo','Nivel','Estado','Registrado'],
      ...filtrados.map((a) => [
        a.dni, a.nombre, a.apellidos, formatFecha(a.fechaNacimiento),
        a.telefono ?? '', a.emailAcademia ?? '', a.direccion ?? '', a.apoderado ?? '',
        ciclos.find((c) => c.id === a.cicloId)?.nombre ?? '',
        niveles.find((n) => n.id === a.nivelId)?.nombre ?? '',
        a.activo ? 'Activo' : 'Inactivo',
        formatRegistro(a.registradoEn),
      ]),
    ]
    const csv  = filas.map((f) => f.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'alumnos.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function confirmarEliminar() {
    if (!modal || modal.tipo !== 'eliminar') return
    startTransition(async () => {
      await eliminarAlumno(modal.alumno.id)
      setModal(null)
    })
  }

  return (
    <div className={styles.page}>
      {/* Modales */}
      {modal?.tipo === 'cred'     && <ModalCredenciales alumno={modal.alumno} onClose={() => setModal(null)} />}
      {modal?.tipo === 'editar'   && <ModalEditar alumno={modal.alumno} ciclos={ciclos} niveles={niveles} onClose={() => setModal(null)} />}
      {modal?.tipo === 'eliminar' && (
        <ModalEliminar
          alumno={modal.alumno}
          onClose={() => setModal(null)}
          onConfirm={confirmarEliminar}
          cargando={isPending}
        />
      )}

      {/* Cabecera */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}><Users size={22} /></div>
          <div>
            <h1 className={styles.titulo}>Alumnos</h1>
            <p className={styles.sub}>{alumnos.length} registrados · {filtrados.length} mostrados</p>
          </div>
        </div>
        <button className={styles.btnExportar} onClick={exportarCSV}>
          <Download size={15} /> Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filtros}>
        <div className={styles.buscador}>
          <Search size={15} className={styles.buscadorIcono} />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI, correo…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={styles.inputBusqueda}
          />
        </div>
        <div className={styles.selects}>
          <select value={filtroCiclo} onChange={(e) => setFiltroCiclo(e.target.value)} className={styles.select}>
            <option value="">Todos los ciclos</option>
            {ciclos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select value={filtroNivel} onChange={(e) => setFiltroNivel(e.target.value)} className={styles.select}>
            <option value="">Todos los niveles</option>
            {niveles.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* Tabla */}
      {filtrados.length === 0 ? (
        <div className={styles.vacio}><Users size={40} strokeWidth={1} /><p>No hay alumnos que coincidan.</p></div>
      ) : (
        <div className={styles.tablaWrap}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre completo</th>
                <th>Correo academia</th>
                <th>Teléfono</th>
                <th>Ciclo</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((a) => (
                <tr key={a.id}>
                  <td className={styles.tdDni}>{a.dni}</td>
                  <td className={styles.tdNombre}>{a.apellidos}, {a.nombre}</td>
                  <td className={styles.tdEmail}>
                    {a.emailAcademia
                      ? <span className={styles.emailAsignado}>{a.emailAcademia}</span>
                      : <span className={styles.emailPendiente}>Sin asignar</span>}
                  </td>
                  <td>{a.telefono ?? '—'}</td>
                  <td>{ciclos.find((c) => c.id === a.cicloId)?.nombre ?? '—'}</td>
                  <td>{niveles.find((n) => n.id === a.nivelId)?.nombre ?? '—'}</td>
                  <td>
                    <span className={a.activo ? styles.badgeActivo : styles.badgeInactivo}>
                      {a.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={styles.tdFecha}>{formatRegistro(a.registradoEn)}</td>
                  <td>
                    <div className={styles.acciones}>
                      <button className={styles.btnAccion} title="Editar datos"
                        onClick={() => setModal({ tipo: 'editar', alumno: a })}>
                        <Pencil size={14} />
                      </button>
                      <button className={styles.btnAccion} title="Credenciales"
                        onClick={() => setModal({ tipo: 'cred', alumno: a })}>
                        <KeyRound size={14} />
                      </button>
                      <button className={`${styles.btnAccion} ${styles.btnAccionRojo}`} title="Eliminar"
                        onClick={() => setModal({ tipo: 'eliminar', alumno: a })}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
