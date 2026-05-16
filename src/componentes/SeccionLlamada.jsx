'use client'
import { useAparecer } from './useAparecer'
import styles from './SeccionLlamada.module.css'

const IconoWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
  </svg>
)

const IconoFacebook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.6c0-2.2 1.3-3.4 3.3-3.4.9 0 1.9.2 1.9.2v2.1h-1.1c-1.1 0-1.4.7-1.4 1.3v1.6h2.4l-.4 2.9h-2v7A10 10 0 0022 12z"/>
  </svg>
)

const IconoMapa = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
  </svg>
)

export default function SeccionLlamada({ sitio }) {
  const { ref, visible } = useAparecer(0.1)

  return (
    <section className={styles.section}>
      <div ref={ref} className={`${styles.inner} ${visible ? styles.visible : ''}`}>
        <div className={styles.glow} />

        <p className={styles.eyebrow}>¿Listo para el siguiente nivel?</p>
        <h2 className={styles.heading}>Asegura tu <span>vacante</span> hoy</h2>
        <p className={styles.sub}>Las vacantes son limitadas. Contáctanos por WhatsApp o síguenos en Facebook.</p>

        <div className={styles.buttons}>
          <a href={sitio?.whatsapp ?? '#'} target="_blank" rel="noreferrer" className={styles.waBtn}>
            <IconoWhatsApp />
            WhatsApp · {sitio?.telefono ?? ''}
          </a>
          <a href="https://www.facebook.com/profile.php?id=100077041334646" target="_blank" rel="noreferrer" className={styles.fbBtn}>
            <IconoFacebook />
            Facebook
          </a>
        </div>

        <div className={styles.locationBox}>
          <IconoMapa />
          <div>
            <div className={styles.locationLabel}>Ubicación</div>
            <div className={styles.locationText}>{sitio?.lugarInscripcion ?? ''}</div>
          </div>
          <a href={sitio?.urlMapa ?? '#'} target="_blank" rel="noreferrer" className={styles.mapBtn}>
            Ver mapa →
          </a>
        </div>

        <p className={styles.hint}>Respuesta inmediata por WhatsApp</p>
      </div>
    </section>
  )
}
