-- Migración: foto de perfil del alumno
-- psql $DATABASE_URL -f sql/07_alumno_foto.sql

ALTER TABLE alumnos
  ADD COLUMN IF NOT EXISTS foto_url TEXT;
