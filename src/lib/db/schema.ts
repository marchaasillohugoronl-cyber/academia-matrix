import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

// ── Ciclos ────────────────────────────────────
export const ciclos = pgTable('ciclos', {
  id:               text('id').primaryKey(),         // 'sabatino' | 'verano' | 'anual'
  nombre:           text('nombre').notNull(),
  emoji:            text('emoji'),
  color:            text('color').notNull(),
  etiqueta:         text('etiqueta'),
  descripcion:      text('descripcion'),
  duracion:         text('duracion'),
  totalHoras:       text('total_horas'),
  precio:           integer('precio'),
  etiquetaPrecio:   text('etiqueta_precio'),
  subPrecio:        text('sub_precio'),
  turnos:           text('turnos').array(),
  inicioInscripcion: text('inicio_inscripcion'),
  finInscripcion:   text('fin_inscripcion'),
  inicioClases:     text('inicio_clases'),
  estadisticas:     jsonb('estadisticas')
                      .$type<{ numero: string; etiqueta: string }[]>(),
  niveles:          text('niveles').array(),          // ['primaria','secundaria',...]
  activo:           boolean('activo').default(true),
  updatedAt:        timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// ── Niveles ───────────────────────────────────
export const niveles = pgTable('niveles', {
  id:     text('id').primaryKey(),   // 'primaria' | 'secundaria' | 'preuniversitario'
  nombre: text('nombre').notNull(),
  emoji:  text('emoji'),
  color:  text('color'),
  icono:  text('icono'),             // nombre de icono Lucide, ej: 'BookOpen'
  orden:  integer('orden').default(0),
})

// ── Cursos ────────────────────────────────────
export const cursos = pgTable('cursos', {
  id:      uuid('id').primaryKey().defaultRandom(),
  nivelId: text('nivel_id').references(() => niveles.id, { onDelete: 'cascade' }),
  nombre:  text('nombre').notNull(),
  icono:   text('icono'),            // emoji o nombre Lucide
  orden:   integer('orden').default(0),
})

// ── Configuración del sitio (clave → valor) ───
export const configuracion = pgTable('configuracion', {
  clave: text('clave').primaryKey(),
  valor: text('valor'),
})

// ── Usuarios (administradores) ────────────────
export const usuarios = pgTable('usuarios', {
  id:           uuid('id').primaryKey().defaultRandom(),
  email:        text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  nombre:       text('nombre').notNull(),
  rol:          text('rol').notNull().default('admin'),
  activo:       boolean('activo').default(true),
  creadoEn:     timestamp('creado_en', { withTimezone: true }).defaultNow(),
})

// ── Alumnos ───────────────────────────────────
export const alumnos = pgTable('alumnos', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  dni:                  text('dni').notNull().unique(),
  nombre:               text('nombre').notNull(),
  apellidos:            text('apellidos').notNull(),
  fechaNacimiento:      text('fecha_nacimiento').notNull(),  // 'YYYY-MM-DD'
  telefono:             text('telefono'),
  emailAcademia:        text('email_academia').unique(),
  emailPersonal:        text('email_personal'),
  passwordHash:         text('password_hash'),
  direccion:            text('direccion'),
  apoderado:            text('apoderado'),
  telefonoApoderado:    text('telefono_apoderado'),
  fotoUrl:              text('foto_url'),
  primerLogin:          boolean('primer_login').default(true),
  aceptoTerminos:       boolean('acepto_terminos').default(false),
  aceptoNotificaciones: boolean('acepto_notificaciones').default(false),
  cicloId:              text('ciclo_id').references(() => ciclos.id),
  nivelId:              text('nivel_id').references(() => niveles.id),
  activo:               boolean('activo').default(true),
  registradoEn:         timestamp('registrado_en', { withTimezone: true }).defaultNow(),
})

// ── Anuncios ──────────────────────────────────
export const anuncios = pgTable('anuncios', {
  id:        uuid('id').primaryKey().defaultRandom(),
  titulo:    text('titulo').notNull(),
  contenido: text('contenido').notNull(),
  publicado: boolean('publicado').default(false),
  creadoEn:  timestamp('creado_en', { withTimezone: true }).defaultNow(),
})

// ── Encuestas ─────────────────────────────────
export const encuestas = pgTable('encuestas', {
  id:          uuid('id').primaryKey().defaultRandom(),
  titulo:      text('titulo').notNull(),
  descripcion: text('descripcion'),
  activa:      boolean('activa').default(false),
  creadaEn:    timestamp('creada_en', { withTimezone: true }).defaultNow(),
})

export const preguntasEncuesta = pgTable('preguntas_encuesta', {
  id:         uuid('id').primaryKey().defaultRandom(),
  encuestaId: uuid('encuesta_id').references(() => encuestas.id, { onDelete: 'cascade' }),
  texto:      text('texto').notNull(),
  tipo:       text('tipo').notNull(),  // 'multiple' | 'texto' | 'escala'
  opciones:   jsonb('opciones').$type<string[]>(),
  orden:      integer('orden').default(0),
})

export const respuestasEncuesta = pgTable('respuestas_encuesta', {
  id:           uuid('id').primaryKey().defaultRandom(),
  encuestaId:   uuid('encuesta_id').references(() => encuestas.id),
  preguntaId:   uuid('pregunta_id').references(() => preguntasEncuesta.id),
  alumnoId:     uuid('alumno_id').references(() => alumnos.id),
  respuesta:    text('respuesta'),
  respondidoEn: timestamp('respondido_en', { withTimezone: true }).defaultNow(),
})

// ── Exámenes ──────────────────────────────────
export const examenes = pgTable('examenes', {
  id:               uuid('id').primaryKey().defaultRandom(),
  titulo:           text('titulo').notNull(),
  descripcion:      text('descripcion'),
  duracionMinutos:  integer('duracion_minutos').default(30),
  activo:           boolean('activo').default(false),
  creadoEn:         timestamp('creado_en', { withTimezone: true }).defaultNow(),
})

export const preguntasExamen = pgTable('preguntas_examen', {
  id:               uuid('id').primaryKey().defaultRandom(),
  examenId:         uuid('examen_id').references(() => examenes.id, { onDelete: 'cascade' }),
  tipo:             text('tipo').notNull(),  // 'multiple' | 'texto'
  enunciado:        text('enunciado').notNull(),
  opciones:         jsonb('opciones').$type<string[]>(),
  respuestaCorrecta: text('respuesta_correcta'),
  puntaje:          integer('puntaje').default(1),
  orden:            integer('orden').default(0),
})

export const entregasExamen = pgTable('entregas_examen', {
  id:           uuid('id').primaryKey().defaultRandom(),
  examenId:     uuid('examen_id').references(() => examenes.id),
  alumnoId:     uuid('alumno_id').references(() => alumnos.id),
  respuestas:   jsonb('respuestas').$type<Record<string, string>>(),
  puntajeAuto:  integer('puntaje_auto'),
  puntajeFinal: integer('puntaje_final'),
  enviadoEn:    timestamp('enviado_en', { withTimezone: true }).defaultNow(),
  calificado:   boolean('calificado').default(false),
})

// ── Tipos inferidos ───────────────────────────
export type Ciclo           = typeof ciclos.$inferSelect
export type Nivel           = typeof niveles.$inferSelect
export type Curso           = typeof cursos.$inferSelect
export type Config          = typeof configuracion.$inferSelect
export type Usuario         = typeof usuarios.$inferSelect
export type Alumno          = typeof alumnos.$inferSelect
export type Anuncio         = typeof anuncios.$inferSelect
export type Encuesta        = typeof encuestas.$inferSelect
export type PreguntaEncuesta = typeof preguntasEncuesta.$inferSelect
export type Examen          = typeof examenes.$inferSelect
export type PreguntaExamen  = typeof preguntasExamen.$inferSelect
export type EntregaExamen   = typeof entregasExamen.$inferSelect
