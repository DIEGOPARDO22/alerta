'use client';
import Head from 'next/head';
import styles from './page.module.css';
import AmberAlert from './paginas/alertaAmber';
import ReportModal from './components/ReportModal';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Image from next/image
import { useRouter } from 'next/navigation'; // Correct import for useRouter

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [denunciante, setDenunciante] = useState('');
  const [hora, setHora] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fecha, setFecha] = useState('');

  const handleReportClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (denunciante: string, hora: string, ubicacion: string, fecha: string) => {
    const mensaje = `Datos del desaparecido:\nNombre: Juan Pérez\nEdad: 10 años\nFecha de desaparición: 01/06/2024\nÚltima ubicación conocida: Parque Central\n\nDatos del denunciante:\nNombre: ${denunciante}\nHora: ${hora}\nUbicación: ${ubicacion}\nFecha: ${fecha}`;
    const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(mensaje)}`;
  
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
      setIsModalOpen(false);
    } else {
      console.error('window object is not available');
    }
  };
  


  useEffect(() => {
    // Any side effects that do not belong to handleSubmit can go here
  }, []); // Empty dependency array if there are no dependencies

  return (
    <div className={styles.container}>
      <Head>
        <title>Alerta Amber</title>
        <meta name="description" content="Página de información sobre una persona desaparecida" />
      </Head>

      <main className={styles.main}>
        <AmberAlert onReport={handleReportClick} />
      </main>
      <footer className={styles.footer}>
        <div className={styles.whatsappIconContainer}>
          <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer" className={styles.whatsappIcon}>
            <Image src="/whatsapp-removebg-previe.png" alt="WhatsApp" width={60} height={60} />
          </a>
        </div>
      </footer>
      {isModalOpen && (
        <ReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
