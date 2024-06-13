// pages/error.tsx

import Head from 'next/head';
import styles from './error.module.css'; // Estilos para la página de error
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Error - Alerta Amber</title>
        <meta name="description" content="Página de error en la aplicación Alerta Amber" />
      </Head>

      <main className={styles.main}>
        <h1>¡Ups! Algo salió mal...</h1>
        <p>Lo sentimos, pero ocurrió un error inesperado.</p>
        <Link href="/" className={styles.link}>
          Volver a la página principal
        </Link>
      </main>
    </div>
  );
}
