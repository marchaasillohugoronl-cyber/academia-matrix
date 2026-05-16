-- ══════════════════════════════════════════════════════
--  DATOS DE EJEMPLO — Academia MATRIX
--  Ejecutar DESPUÉS de 01_base.sql y 02_alumnos_sistema.sql
-- ══════════════════════════════════════════════════════

-- ── ANUNCIOS ──────────────────────────────────────────

INSERT INTO anuncios (id, titulo, contenido, publicado, creado_en) VALUES

  (gen_random_uuid(),
   'Inicio de clases — Ciclo Sabatino 2025',
   'Se informa a todos los alumnos inscritos que las clases del Ciclo Sabatino comenzarán el sábado 17 de mayo a las 8:00 a.m. en nuestra sede de Cabanillas. Se solicita puntualidad y traer los materiales indicados en el cronograma.',
   TRUE,
   NOW()),

  (gen_random_uuid(),
   'Cambio de horario — Turno tarde',
   'A partir de la próxima semana el turno tarde iniciará a las 3:00 p.m. en lugar de las 2:30 p.m. Esta modificación aplica solo para los grupos de secundaria y preuniversitario. Cualquier consulta comunicarse por WhatsApp.',
   TRUE,
   NOW() - INTERVAL '3 days'),

  (gen_random_uuid(),
   'Simulacro de admisión UNSA — 24 de mayo',
   'El próximo 24 de mayo se realizará un simulacro completo de examen de admisión UNSA. La prueba tendrá una duración de 3 horas e incluirá los cursos de Matemática, Física, Química, Lenguaje y Razonamiento. La participación es obligatoria para los alumnos del área preuniversitaria.',
   TRUE,
   NOW() - INTERVAL '1 day');


-- ══════════════════════════════════════════════════════
--  EXAMEN DE EJEMPLO — Álgebra Básica
-- ══════════════════════════════════════════════════════

-- 1. Insertar el examen (guardamos el id en una variable)
WITH examen AS (
  INSERT INTO examenes (id, titulo, descripcion, duracion_minutos, activo, creado_en)
  VALUES (
    '11111111-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    'Examen de Álgebra — Nivel Secundaria',
    'Evaluación de conceptos básicos: operaciones con polinomios, factorización y ecuaciones de primer grado.',
    40,
    TRUE,
    NOW()
  )
  RETURNING id
)

-- 2. Insertar las preguntas del examen
INSERT INTO preguntas_examen (id, examen_id, tipo, enunciado, opciones, respuesta_correcta, puntaje, orden)
SELECT
  gen_random_uuid(),
  '11111111-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
  tipo, enunciado, opciones::jsonb, respuesta_correcta, puntaje, orden
FROM (VALUES

  ('multiple',
   '¿Cuál es el resultado de (2x + 3)(x − 1)?',
   '["2x² + x − 3", "2x² − x − 3", "2x² + 5x − 3", "2x² − 5x + 3"]',
   '0', 2, 1),

  ('multiple',
   'Factoriza completamente: x² − 9',
   '["(x − 3)²", "(x + 3)(x − 3)", "(x − 3)(x − 3)", "(x + 9)(x − 1)"]',
   '1', 2, 2),

  ('multiple',
   'Resuelve para x: 3x − 7 = 14',
   '["x = 3", "x = 5", "x = 7", "x = 9"]',
   '2', 2, 3),

  ('multiple',
   '¿Cuál es el valor de x² − 4x + 4 cuando x = 3?',
   '["1", "5", "7", "13"]',
   '0', 2, 4),

  ('texto',
   'Simplifica la siguiente expresión y escribe el resultado: (3a²b)(2ab³)',
   NULL,
   '6a³b⁴', 4, 5)

) AS t(tipo, enunciado, opciones, respuesta_correcta, puntaje, orden);


-- ══════════════════════════════════════════════════════
--  ENCUESTA DE EJEMPLO — Satisfacción del ciclo
-- ══════════════════════════════════════════════════════

-- 1. Insertar la encuesta
WITH enc AS (
  INSERT INTO encuestas (id, titulo, descripcion, activa, creada_en)
  VALUES (
    '22222222-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    'Encuesta de Satisfacción — Ciclo Sabatino 2025',
    'Tu opinión es importante para mejorar la calidad de nuestra enseñanza. Responde con sinceridad. Tiempo estimado: 3 minutos.',
    TRUE,
    NOW()
  )
  RETURNING id
)

-- 2. Insertar las preguntas de la encuesta
INSERT INTO preguntas_encuesta (id, encuesta_id, texto, tipo, opciones, orden)
SELECT
  gen_random_uuid(),
  '22222222-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
  texto, tipo, opciones::jsonb, orden
FROM (VALUES

  ('¿Cómo calificarías la calidad de las clases recibidas?',
   'escala', NULL, 1),

  ('¿El docente explica los temas con claridad y ejemplos entendibles?',
   'multiple',
   '["Siempre", "Casi siempre", "A veces", "Casi nunca"]',
   2),

  ('¿El ritmo de las clases es adecuado para ti?',
   'multiple',
   '["Demasiado rápido", "Adecuado", "Demasiado lento"]',
   3),

  ('¿Cómo calificarías el ambiente y la infraestructura del aula?',
   'escala', NULL, 4),

  ('¿Recomendarías Academia MATRIX a un familiar o amigo?',
   'multiple',
   '["Sí, definitivamente", "Probablemente sí", "Probablemente no", "No"]',
   5),

  ('¿Qué aspecto te gustaría que mejoráramos? (opcional)',
   'texto', NULL, 6)

) AS t(texto, tipo, opciones, orden);
