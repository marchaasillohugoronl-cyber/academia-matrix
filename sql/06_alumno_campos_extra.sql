-- ── Migración: campos adicionales de alumno ──────────────
-- Ejecutar con: psql $DATABASE_URL -f sql/06_alumno_campos_extra.sql

ALTER TABLE alumnos
  ADD COLUMN IF NOT EXISTS direccion           TEXT,
  ADD COLUMN IF NOT EXISTS apoderado           TEXT,
  ADD COLUMN IF NOT EXISTS telefono_apoderado  TEXT;
