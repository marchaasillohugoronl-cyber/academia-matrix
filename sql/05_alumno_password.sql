-- ── Migración: contraseña de acceso para alumnos ─────────
-- Ejecutar con: psql $DATABASE_URL -f sql/05_alumno_password.sql

ALTER TABLE alumnos
  ADD COLUMN IF NOT EXISTS password_hash TEXT;
