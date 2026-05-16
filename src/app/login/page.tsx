import FormularioLogin from './FormularioLogin'
import styles from './login.module.css'

export default function PaginaLogin() {
  return (
    <main className={styles.pagina}>
      <div className={styles.caja}>
        <div className={styles.logo}>MATRIX</div>
        <p className={styles.subtitulo}>Panel de Administración</p>
        <FormularioLogin />
      </div>
    </main>
  )
}
