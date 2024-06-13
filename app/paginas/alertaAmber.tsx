import React from 'react';
import Image from 'next/image';
import styles from './AmberAlert.module.css';
import alertIcon from '../../public/alertIcon-removebg-preview.png';
import missingPerson from '../../public/niño.jpg';

interface AmberAlertProps {
    onReport: () => void;
}


const AmberAlert: React.FC<AmberAlertProps> = ({ onReport }) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>ALERTA AMBER</h1>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Image src={alertIcon} alt="Alerta Amber Logo" className={styles.logo} />
                    <p className={styles.alertText}>ATENCIÓN</p>
                </div>
                <div className={styles.body}>
                    <Image src={missingPerson} alt="Missing Person" className={styles.personImage} />
                    <h2>Manuel Alvaro Caceres Rivera</h2>
                    <div className={styles.infoSection}>
                        <h3>CARACTERISTICAS FÍSICAS</h3>
                        <p>Género masculino, de talla 1.57, contextura delgada, cabello oscuro y lacio, ojos marrones, piel morena</p>
                    </div>
                    <div className={styles.infoSection}>
                        <h3>HECHOS</h3>
                        <p>El día 11 de Mayo fue visto por última vez en el colegio a horas 2:00 pm, sin retorno a casa. Desde ese instante no se tiene comunicación del menor y se desconoce su paradero.</p>
                    </div>
                    <div className={styles.infoSection}>
                        <p><strong>EDAD:</strong> 5 AÑOS</p>
                        <p><strong>LUGAR DE LOS HECHOS Y HORA:</strong> CAYMA - 3:00 PM</p>
                        <p><strong>ÚLTIMA UBICACIÓN:</strong> COLEGIO</p>
                    </div>
                </div>
                <div className={styles.actionButtons}>
                    <button className={styles.reportButton} onClick={onReport}>Reportar</button>
                </div>
            </div>
        </div>
    );
};

export default AmberAlert;