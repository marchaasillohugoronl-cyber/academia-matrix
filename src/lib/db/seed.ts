/**
 * Poblar la BD con los datos actuales de sitio.js
 * Ejecutar: npm run db:seed
 */
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import bcrypt from 'bcryptjs'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function seed() {
  console.log('🌱 Iniciando seed...')

  // Configuración del sitio (SITIO en sitio.js)
  await db.insert(schema.configuracion).values([
    { clave: 'nombre',           valor: 'Academia de Matemáticas MATRIX' },
    { clave: 'nombreCorto',      valor: 'MATRIX' },
    { clave: 'telefono',         valor: '922977802' },
    { clave: 'whatsapp',         valor: 'https://wa.me/51922977802' },
    { clave: 'ubicacion',        valor: 'Cabanillas, Perú' },
    { clave: 'lugarInscripcion', valor: 'Plaza de Armas – Cabanillas' },
    { clave: 'lugarClases',      valor: 'Colegio Mixto de Cabanillas' },
    { clave: 'urlMapa',          valor: 'https://maps.google.com/?q=Plaza+de+Armas+Cabanillas+Puno+Peru' },
  ]).onConflictDoNothing()
  console.log('  ✓ Configuración')

  // Niveles (INFO_NIVELES en sitio.js)
  await db.insert(schema.niveles).values([
    { id: 'primaria',        nombre: 'Primaria',        emoji: '📚', color: '#00d4ff', icono: 'BookOpen',    orden: 1 },
    { id: 'secundaria',      nombre: 'Secundaria',      emoji: '🎓', color: '#ff6b00', icono: 'GraduationCap', orden: 2 },
    { id: 'preuniversitario', nombre: 'Preuniversitario', emoji: '🎯', color: '#7c3aed', icono: 'Target',     orden: 3 },
  ]).onConflictDoNothing()
  console.log('  ✓ Niveles')

  // Ciclos (CICLOS en sitio.js)
  await db.insert(schema.ciclos).values([
    {
      id:               'sabatino',
      nombre:           'Ciclo Sabatino',
      emoji:            '📅',
      color:            '#00d4ff',
      etiqueta:         'INSCRIPCIONES ABIERTAS',
      descripcion:      'Reforzamiento semanal cada sábado. Ideal para estudiantes que necesitan apoyo constante durante el año escolar.',
      duracion:         '4 semanas',
      totalHoras:       '16 horas',
      precio:           47,
      etiquetaPrecio:   'S/ 47',
      subPrecio:        'mensual',
      turnos:           null,
      inicioInscripcion: 'Jueves 14 de mayo',
      finInscripcion:   'Viernes 22 de mayo',
      inicioClases:     '23 de mayo',
      estadisticas:     [
        { numero: '4',    etiqueta: 'Semanas' },
        { numero: '16h',  etiqueta: 'Total clases' },
        { numero: '3',    etiqueta: 'Niveles' },
        { numero: 'S/47', etiqueta: 'Mensual' },
      ],
      niveles:          ['primaria', 'secundaria', 'preuniversitario'],
      activo:           true,
    },
    {
      id:               'verano',
      nombre:           'Ciclo Vacacional Verano 2027',
      emoji:            '☀️',
      color:            '#ff6b00',
      etiqueta:         'INSCRIPCIONES ABIERTAS',
      descripcion:      'Preparación intensiva durante las vacaciones de verano. Dos turnos disponibles para mayor comodidad.',
      duracion:         '6 semanas',
      totalHoras:       '72 horas',
      precio:           167,
      etiquetaPrecio:   'S/ 167',
      subPrecio:        'ciclo completo',
      turnos:           ['Mañana', 'Tarde'],
      inicioInscripcion: '1 de diciembre',
      finInscripcion:   '10 de enero',
      inicioClases:     '11 de enero',
      estadisticas:     [
        { numero: '6',     etiqueta: 'Semanas' },
        { numero: '72h',   etiqueta: 'Total clases' },
        { numero: '3',     etiqueta: 'Niveles' },
        { numero: 'S/167', etiqueta: 'Ciclo completo' },
      ],
      niveles:          ['primaria', 'secundaria', 'preuniversitario'],
      activo:           true,
    },
    {
      id:               'anual',
      nombre:           'Ciclo Anual',
      emoji:            '📆',
      color:            '#7c3aed',
      etiqueta:         'PRÓXIMAMENTE',
      descripcion:      'Preparación continua a lo largo del año para secundaria y preuniversitario. Turno tarde.',
      duracion:         '10 horas / semana',
      totalHoras:       '10h por semana',
      precio:           87,
      etiquetaPrecio:   'S/ 87',
      subPrecio:        'mensual',
      turnos:           ['Tarde'],
      inicioInscripcion: 'Próximamente',
      finInscripcion:   'Próximamente',
      inicioClases:     'Próximamente',
      estadisticas:     [
        { numero: '10h',   etiqueta: 'Por semana' },
        { numero: '2',     etiqueta: 'Niveles' },
        { numero: 'Tarde', etiqueta: 'Turno' },
        { numero: 'S/87',  etiqueta: 'Mensual' },
      ],
      niveles:          ['secundaria', 'preuniversitario'],
      activo:           true,
    },
  ]).onConflictDoNothing()
  console.log('  ✓ Ciclos')

  // Cursos (CURSOS en sitio.js)
  const cursosData = [
    // Primaria
    { nivelId: 'primaria', nombre: 'Álgebra',                icono: '➕', orden: 1 },
    { nivelId: 'primaria', nombre: 'Aritmética',             icono: '🔢', orden: 2 },
    { nivelId: 'primaria', nombre: 'Geometría',              icono: '📐', orden: 3 },
    { nivelId: 'primaria', nombre: 'Razonamiento Matemático', icono: '🧠', orden: 4 },
    { nivelId: 'primaria', nombre: 'Física',                 icono: '⚡', orden: 5 },
    // Secundaria
    { nivelId: 'secundaria', nombre: 'Geometría',            icono: '📐', orden: 1 },
    { nivelId: 'secundaria', nombre: 'Álgebra',              icono: '➕', orden: 2 },
    { nivelId: 'secundaria', nombre: 'Trigonometría',        icono: '📏', orden: 3 },
    { nivelId: 'secundaria', nombre: 'Aritmética',           icono: '🔢', orden: 4 },
    { nivelId: 'secundaria', nombre: 'Física',               icono: '⚡', orden: 5 },
    { nivelId: 'secundaria', nombre: 'Razonamiento Matemático', icono: '🧠', orden: 6 },
    // Preuniversitario
    { nivelId: 'preuniversitario', nombre: 'Álgebra',            icono: '➕', orden: 1 },
    { nivelId: 'preuniversitario', nombre: 'Geometría',          icono: '📐', orden: 2 },
    { nivelId: 'preuniversitario', nombre: 'Trigonometría',      icono: '📏', orden: 3 },
    { nivelId: 'preuniversitario', nombre: 'Aritmética',         icono: '🔢', orden: 4 },
    { nivelId: 'preuniversitario', nombre: 'Física',             icono: '⚡', orden: 5 },
    { nivelId: 'preuniversitario', nombre: 'Química',            icono: '🧪', orden: 6 },
    { nivelId: 'preuniversitario', nombre: 'Razonamiento Matemático', icono: '🧠', orden: 7 },
    { nivelId: 'preuniversitario', nombre: 'Razonamiento Verbal', icono: '📖', orden: 8 },
  ]

  await db.insert(schema.cursos).values(cursosData).onConflictDoNothing()
  console.log('  ✓ Cursos')

  // Usuario administrador
  const passwordHash = await bcrypt.hash('Admin2024*', 10)
  await db.insert(schema.usuarios).values([
    {
      email:        'admin@academiamatrix.com',
      passwordHash,
      nombre:       'Administrador',
      rol:          'admin',
      activo:       true,
    },
  ]).onConflictDoNothing()
  console.log('  ✓ Usuario admin')

  console.log('✅ Seed completado exitosamente')
  process.exit(0)
}

seed().catch((e) => { console.error('❌ Error en seed:', e); process.exit(1) })
