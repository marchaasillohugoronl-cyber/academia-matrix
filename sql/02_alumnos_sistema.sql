-- ── Alumnos ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alumnos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dni              TEXT NOT NULL UNIQUE,
  nombre           TEXT NOT NULL,
  apellidos        TEXT NOT NULL,
  fecha_nacimiento TEXT NOT NULL,          -- 'YYYY-MM-DD'
  telefono         TEXT,
  ciclo_id         TEXT REFERENCES ciclos(id),
  nivel_id         TEXT REFERENCES niveles(id),
  activo           BOOLEAN DEFAULT TRUE,
  registrado_en    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Anuncios ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anuncios (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo     TEXT NOT NULL,
  contenido  TEXT NOT NULL,
  publicado  BOOLEAN DEFAULT FALSE,
  creado_en  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Encuestas ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS encuestas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  descripcion TEXT,
  activa      BOOLEAN DEFAULT FALSE,
  creada_en   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preguntas_encuesta (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encuesta_id UUID REFERENCES encuestas(id) ON DELETE CASCADE,
  texto       TEXT NOT NULL,
  tipo        TEXT NOT NULL,               -- 'multiple' | 'texto' | 'escala'
  opciones    JSONB,                       -- ["A) ...", "B) ..."]
  orden       INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS respuestas_encuesta (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encuesta_id   UUID REFERENCES encuestas(id),
  pregunta_id   UUID REFERENCES preguntas_encuesta(id),
  alumno_id     UUID REFERENCES alumnos(id),
  respuesta     TEXT,
  respondido_en TIMESTAMPTZ DEFAULT NOW()
);

-- ── Exámenes ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS examenes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo            TEXT NOT NULL,
  descripcion       TEXT,
  duracion_minutos  INT DEFAULT 30,
  activo            BOOLEAN DEFAULT FALSE,
  creado_en         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preguntas_examen (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  examen_id         UUID REFERENCES examenes(id) ON DELETE CASCADE,
  tipo              TEXT NOT NULL,         -- 'multiple' | 'texto'
  enunciado         TEXT NOT NULL,
  opciones          JSONB,                 -- ["A) ...", "B) ...", "C) ...", "D) ..."]
  respuesta_correcta TEXT,                -- solo para tipo 'multiple'
  puntaje           INT DEFAULT 1,
  orden             INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS entregas_examen (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  examen_id     UUID REFERENCES examenes(id),
  alumno_id     UUID REFERENCES alumnos(id),
  respuestas    JSONB,                    -- { "pregunta_id": "respuesta_dada" }
  puntaje_auto  INT,                      -- calculado automáticamente (múltiple)
  puntaje_final INT,                      -- revisado por el admin
  enviado_en    TIMESTAMPTZ DEFAULT NOW(),
  calificado    BOOLEAN DEFAULT FALSE
);

-- ── Índices útiles ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_alumnos_dni      ON alumnos(dni);
CREATE INDEX IF NOT EXISTS idx_alumnos_nivel    ON alumnos(nivel_id);
CREATE INDEX IF NOT EXISTS idx_alumnos_ciclo    ON alumnos(ciclo_id);
CREATE INDEX IF NOT EXISTS idx_entregas_alumno  ON entregas_examen(alumno_id);
CREATE INDEX IF NOT EXISTS idx_entregas_examen  ON entregas_examen(examen_id);
