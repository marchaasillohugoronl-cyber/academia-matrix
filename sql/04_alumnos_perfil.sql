-- ── Migración: perfil extendido de alumnos ───────────────
-- Ejecutar con: psql $DATABASE_URL -f sql/04_alumnos_perfil.sql

ALTER TABLE alumnos
  ADD COLUMN IF NOT EXISTS email_academia        TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS email_personal        TEXT,
  ADD COLUMN IF NOT EXISTS primer_login          BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS acepto_terminos       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS acepto_notificaciones BOOLEAN DEFAULT FALSE;
