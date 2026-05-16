'use client'

import styles from './Portada.module.css'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserCircle } from 'lucide-react'

const LOGOS_GRUPOS = [
  {
    tipo: 'Universidades',
    logos: [
      { src: '/universidad/Escudo_UNSA.png', alt: 'UNSA' },
      { src: '/universidad/Logo_UNAP.png', alt: 'UNAP' },
      { src: '/universidad/uni_juliaca.svg', alt: 'Universidad Juliaca' },
      { src: '/universidad/Uni.png', alt: 'UNI' },
      { src: '/universidad/uman.svg', alt: 'UMAN' },
      { src: '/universidad/UNMSM.svg', alt: 'UNMSM' },
    ],
  },
  {
    tipo: 'Secundaria',
    logos: [{ src: '/escuela/coar.png', alt: 'COAR' }],
  },
  {
    tipo: 'Primaria',
    logos: [{ src: '/escuela/escuela.png', alt: 'Escuela' }],
  },
]

const TODOS_LOGOS = LOGOS_GRUPOS.flatMap((g) =>
  g.logos.map((l) => ({ ...l, tipo: g.tipo }))
)
const TIRA_LOGOS = [...TODOS_LOGOS, ...TODOS_LOGOS]

function TiraLogos() {
  return (
    <div className={styles.tira}>
      <div className={styles.tiraTrack}>
        {TIRA_LOGOS.map((logo, i) => (
          <div key={i} className={styles.logoCard}>
            <img src={logo.src} alt={logo.alt} className={styles.logoCardImg} />
          </div>
        ))}
      </div>
    </div>
  )
}

function CarruselLogos() {
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndice((i) => (i + 1) % TODOS_LOGOS.length), 2600)
    return () => clearInterval(id)
  }, [])

  const logo = TODOS_LOGOS[indice]

  return (
    <div className={styles.carrusel}>
      <span className={styles.carruselTipo}>{logo.tipo}</span>
      <div className={styles.carruselImgContenedor}>
        <img key={indice} src={logo.src} alt={logo.alt} className={styles.carruselImg} />
      </div>
      <div className={styles.carruselPuntos}>
        {TODOS_LOGOS.map((_, i) => (
          <button
            key={i}
            className={`${styles.punto} ${i === indice ? styles.puntoActivo : ''}`}
            onClick={() => setIndice(i)}
            aria-label={`Logo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Portada() {
  const navegar = useRouter()
  const [ocultarDesc, setOcultarDesc] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setOcultarDesc(true), 5000)
    return () => clearTimeout(t)
  }, [])

  function scrollNiveles(e) {
    e.preventDefault()
    const el = document.getElementById('niveles')
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.pageYOffset - 20,
      behavior: 'smooth',
    })
  }

  return (
    <section className={styles.hero}>

      {/* Badge */}
      <div className={styles.badge}>
        <span className={styles.dot} />
        <span>INSCRIPCIONES ABIERTAS</span>
      </div>

      {/* Título */}
      <p className={styles.subtitle}>Academia de Matemáticas</p>
      <h1 className={styles.title}>
        <span className={styles.line1}>ACADEMIA</span>
        <span className={styles.line2}>MATRIX</span>
      </h1>

      {/* Descripción */}
      <p className={`${styles.desc} ${ocultarDesc ? styles.descOculta : ''}`}>
        Desarrollamos el <strong>razonamiento matemático</strong>, fortalecemos
        las bases y elevamos el rendimiento académico. Preparación intensiva
        para <strong>primaria, secundaria y preuniversitario</strong>.
      </p>

      {/* Botones — Ver detalles | Iniciar sesión | Ciclos */}
      <div className={styles.actionsWrap}>
        <div className={`${styles.actions} ${ocultarDesc ? styles.actionsCentradas : ''}`}>
          <Link href="/portal" className={styles.btnPrimary}>
            <UserCircle size={15} />
            Iniciar sesión
          </Link>
          
          <a href="#" className={styles.btnSecondary} onClick={scrollNiveles}>
            Ver detalles →
          </a>



          <button onClick={() => navegar.push('/ciclos')} className={styles.btnCiclos}>
            Ciclos
          </button>

        </div>
      </div>

      {/* Logos */}
      <div className={styles.logosBloque}>
        <span className={styles.uniLabel}>Preparación para ingreso a:</span>

        <div className={styles.carruselContenedor}>
          <CarruselLogos />
        </div>

        <div className={styles.tiraContenedor}>
          <TiraLogos />
        </div>
      </div>

    </section>
  )
}
