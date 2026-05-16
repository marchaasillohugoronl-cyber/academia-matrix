CREATE TABLE "alumnos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dni" text NOT NULL,
	"nombre" text NOT NULL,
	"apellidos" text NOT NULL,
	"fecha_nacimiento" text NOT NULL,
	"telefono" text,
	"email_academia" text,
	"email_personal" text,
	"password_hash" text,
	"direccion" text,
	"apoderado" text,
	"telefono_apoderado" text,
	"foto_url" text,
	"primer_login" boolean DEFAULT true,
	"acepto_terminos" boolean DEFAULT false,
	"acepto_notificaciones" boolean DEFAULT false,
	"ciclo_id" text,
	"nivel_id" text,
	"activo" boolean DEFAULT true,
	"registrado_en" timestamp with time zone DEFAULT now(),
	CONSTRAINT "alumnos_dni_unique" UNIQUE("dni"),
	CONSTRAINT "alumnos_email_academia_unique" UNIQUE("email_academia")
);
--> statement-breakpoint
CREATE TABLE "anuncios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"contenido" text NOT NULL,
	"publicado" boolean DEFAULT false,
	"creado_en" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ciclos" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"emoji" text,
	"color" text NOT NULL,
	"etiqueta" text,
	"descripcion" text,
	"duracion" text,
	"total_horas" text,
	"precio" integer,
	"etiqueta_precio" text,
	"sub_precio" text,
	"turnos" text[],
	"inicio_inscripcion" text,
	"fin_inscripcion" text,
	"inicio_clases" text,
	"estadisticas" jsonb,
	"niveles" text[],
	"activo" boolean DEFAULT true,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "configuracion" (
	"clave" text PRIMARY KEY NOT NULL,
	"valor" text
);
--> statement-breakpoint
CREATE TABLE "cursos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nivel_id" text,
	"nombre" text NOT NULL,
	"icono" text,
	"orden" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "encuestas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text,
	"activa" boolean DEFAULT false,
	"creada_en" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "entregas_examen" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"examen_id" uuid,
	"alumno_id" uuid,
	"respuestas" jsonb,
	"puntaje_auto" integer,
	"puntaje_final" integer,
	"enviado_en" timestamp with time zone DEFAULT now(),
	"calificado" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "examenes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text,
	"duracion_minutos" integer DEFAULT 30,
	"activo" boolean DEFAULT false,
	"creado_en" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "niveles" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"emoji" text,
	"color" text,
	"icono" text,
	"orden" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "preguntas_encuesta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"encuesta_id" uuid,
	"texto" text NOT NULL,
	"tipo" text NOT NULL,
	"opciones" jsonb,
	"orden" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "preguntas_examen" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"examen_id" uuid,
	"tipo" text NOT NULL,
	"enunciado" text NOT NULL,
	"opciones" jsonb,
	"respuesta_correcta" text,
	"puntaje" integer DEFAULT 1,
	"orden" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "respuestas_encuesta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"encuesta_id" uuid,
	"pregunta_id" uuid,
	"alumno_id" uuid,
	"respuesta" text,
	"respondido_en" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"nombre" text NOT NULL,
	"rol" text DEFAULT 'admin' NOT NULL,
	"activo" boolean DEFAULT true,
	"creado_en" timestamp with time zone DEFAULT now(),
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_ciclo_id_ciclos_id_fk" FOREIGN KEY ("ciclo_id") REFERENCES "public"."ciclos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_nivel_id_niveles_id_fk" FOREIGN KEY ("nivel_id") REFERENCES "public"."niveles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_nivel_id_niveles_id_fk" FOREIGN KEY ("nivel_id") REFERENCES "public"."niveles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entregas_examen" ADD CONSTRAINT "entregas_examen_examen_id_examenes_id_fk" FOREIGN KEY ("examen_id") REFERENCES "public"."examenes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entregas_examen" ADD CONSTRAINT "entregas_examen_alumno_id_alumnos_id_fk" FOREIGN KEY ("alumno_id") REFERENCES "public"."alumnos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preguntas_encuesta" ADD CONSTRAINT "preguntas_encuesta_encuesta_id_encuestas_id_fk" FOREIGN KEY ("encuesta_id") REFERENCES "public"."encuestas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preguntas_examen" ADD CONSTRAINT "preguntas_examen_examen_id_examenes_id_fk" FOREIGN KEY ("examen_id") REFERENCES "public"."examenes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respuestas_encuesta" ADD CONSTRAINT "respuestas_encuesta_encuesta_id_encuestas_id_fk" FOREIGN KEY ("encuesta_id") REFERENCES "public"."encuestas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respuestas_encuesta" ADD CONSTRAINT "respuestas_encuesta_pregunta_id_preguntas_encuesta_id_fk" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas_encuesta"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respuestas_encuesta" ADD CONSTRAINT "respuestas_encuesta_alumno_id_alumnos_id_fk" FOREIGN KEY ("alumno_id") REFERENCES "public"."alumnos"("id") ON DELETE no action ON UPDATE no action;