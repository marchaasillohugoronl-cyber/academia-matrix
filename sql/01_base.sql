-- ── Ciclos ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ciclos (
  id                TEXT PRIMARY KEY,
  nombre            TEXT NOT NULL,
  emoji             TEXT,
  color             TEXT NOT NULL DEFAULT '#00c8f0',
  etiqueta          TEXT,
  descripcion       TEXT,
  duracion          TEXT,
  total_horas       TEXT,
  precio            INT,
  etiqueta_precio   TEXT,
  sub_precio        TEXT,
  turnos            TEXT[],
  inicio_inscripcion TEXT,
  fin_inscripcion   TEXT,
  inicio_clases     TEXT,
  estadisticas      JSONB,
  niveles           TEXT[],
  activo            BOOLEAN DEFAULT TRUE,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Niveles ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS niveles (
  id     TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  emoji  TEXT,
  color  TEXT,
  icono  TEXT,
  orden  INT DEFAULT 0
);

-- ── Cursos ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cursos (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nivel_id TEXT REFERENCES niveles(id) ON DELETE CASCADE,
  nombre   TEXT NOT NULL,
  icono    TEXT,
  orden    INT DEFAULT 0
);

-- ── Configuración ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS configuracion (
  clave TEXT PRIMARY KEY,
  valor TEXT
);

-- ── Usuarios (admins) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nombre        TEXT NOT NULL,
  rol           TEXT NOT NULL DEFAULT 'admin',
  activo        BOOLEAN DEFAULT TRUE,
  creado_en     TIMESTAMPTZ DEFAULT NOW()
);
