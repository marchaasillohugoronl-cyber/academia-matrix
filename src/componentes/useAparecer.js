import { useEffect, useRef, useState } from 'react';

export function useAparecer(umbral = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => { if (entrada.isIntersecting) setVisible(true); },
      { threshold: umbral }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [umbral]);

  return { ref, visible };
}
