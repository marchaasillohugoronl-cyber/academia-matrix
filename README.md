# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


tablas:

-- ── Niveles ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS niveles (
  id     TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  emoji  TEXT,
  color  TEXT,
  icono  TEXT,
  orden  INTEGER DEFAULT 0
);

-- ── Ciclos ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ciclos (
  id                  TEXT PRIMARY KEY,
  nombre              TEXT NOT NULL,
  emoji               TEXT,
  color               TEXT NOT NULL,
  etiqueta            TEXT,
  descripcion         TEXT,
  duracion            TEXT,
  total_horas         TEXT,
  precio              INTEGER,
  etiqueta_precio     TEXT,
  sub_precio          TEXT,
  turnos              TEXT[],
  inicio_inscripcion  TEXT,
  fin_inscripcion     TEXT,
  inicio_clases       TEXT,
  estadisticas        JSONB,
  niveles             TEXT[],
  activo              BOOLEAN DEFAULT TRUE,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Cursos ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cursos (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nivel_id TEXT REFERENCES niveles(id) ON DELETE CASCADE,
  nombre   TEXT NOT NULL,
  icono    TEXT,
  orden    INTEGER DEFAULT 0
);

-- ── Configuración del sitio ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS configuracion (
  clave TEXT PRIMARY KEY,
  valor TEXT
);