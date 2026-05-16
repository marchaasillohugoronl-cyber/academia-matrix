'use client'
import { useEffect, useRef } from 'react';
import styles from './Particulas.module.css';

export default function Particulas() {
  const refContenedor = useRef(null);

  useEffect(() => {
    const contenedor = refContenedor.current;
    if (!contenedor) return;
    const particulas = [];
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = styles.particle;
      const tamanio = Math.random() * 3 + 1;
      p.style.cssText = `
        left: ${Math.random() * 100}vw;
        width: ${tamanio}px;
        height: ${tamanio}px;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 15}s;
        background: ${Math.random() > 0.75 ? '#ff6b00' : '#00d4ff'};
        border-radius: 50%;
      `;
      contenedor.appendChild(p);
      particulas.push(p);
    }
    return () => particulas.forEach(p => p.remove());
  }, []);

  return <div ref={refContenedor} className={styles.container} />;
}
