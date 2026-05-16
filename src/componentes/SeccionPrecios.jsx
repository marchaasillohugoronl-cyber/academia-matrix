import { CICLOS, SITIO } from '../datos/sitio';
import { useAparecer } from './useAparecer';
import styles from './SeccionPrecios.module.css';

import {
  CalendarDays,
  BookOpen,
  Clock,
  Layers
} from 'lucide-react';

const INCLUYE_PRECIO = [
  'Clases intensivas presenciales',
  'Material de trabajo incluido',
  'Seguimiento académico personalizado',
  '6 semanas de preparación intensiva',
];

const destacado = CICLOS.verano;

const ELEMENTOS_HORARIO = [
  {
    icono: CalendarDays,
    etiqueta: 'Duración del ciclo',
    valor: `${destacado.inicioInscripcion} → ${destacado.inicioClases}`,
  },
  {
    icono: BookOpen,
    etiqueta: 'Días de clase',
    valor: 'Lun, Mié y Vie',
  },
  {
    icono: Clock,
    etiqueta: 'Duración por día',
    valor: '4 horas por sesión',
  },
  {
    icono: Layers,
    etiqueta: 'Carga semanal',
    valor: '12 horas por semana',
  },
];

export default function SeccionPrecios() {
  return null;
}
