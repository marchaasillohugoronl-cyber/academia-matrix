import { useAparecer } from './useAparecer';
import { SITIO, CICLOS } from '../datos/sitio';
import styles from './SeccionInscripcion.module.css';

import {
  CalendarDays,
  Clock,
  MapPin,
  School
} from 'lucide-react';

const destacado = CICLOS.sabatino;

const tarjetas = [
  {
    icono: CalendarDays,
    titulo: 'Período de inscripción',
    valor: `${destacado.inicioInscripcion}`,
    sub: `hasta el ${destacado.finInscripcion}`,
    acento: false,
  },
  {
    icono: Clock,
    titulo: 'Horario de atención',
    valor: '9:00 a.m. – 3:00 p.m.',
    sub: 'Durante el período de inscripción',
    acento: false,
  },
  {
    icono: MapPin,
    titulo: 'Lugar de inscripción',
    valor: SITIO.lugarInscripcion,
    sub: 'Preguntar por Academia MATRIX',
    acento: true,
  },
  {
    icono: School,
    titulo: 'Lugar de clases',
    valor: SITIO.lugarClases,
    sub: `Inicio de clases: ${destacado.inicioClases}`,
    acento: true,
  },
];

function TarjetaInfo({ icono: Icono, titulo, valor, sub, acento, retraso }) {
  const { ref, visible } = useAparecer();

  return (
    <div
      ref={ref}
      className={`${styles.card} ${acento ? styles.orange : ''} ${
        visible ? styles.visible : ''
      }`}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      <span className={styles.icon}>
        <Icono size={26} />
      </span>

      <div className={styles.cardTitle}>{titulo}</div>
      <div className={styles.cardValue}>{valor}</div>
      <div className={styles.cardSub}>{sub}</div>
    </div>
  );
}

export default function SeccionInscripcion() {
  return null;
}
