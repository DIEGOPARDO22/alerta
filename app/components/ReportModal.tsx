// components/ReportModal.tsx
import React, { useState, useEffect } from 'react';
import style from './ReportModal.module.css';
import dynamic from 'next/dynamic';

// Importar dinámicamente el componente LocationPicker
const LocationPicker = dynamic(() => import('./LocationPicker'), { ssr: false });

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (denunciante: string, hora: string, ubicacion: string, fecha: string) => void;
}


const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [denunciante, setDenunciante] = useState('');
  const [hora, setHora] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fecha, setFecha] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDenunciante('');
      setHora('');
      setUbicacion('');
      setFecha('');
      setCoordinates(null);
      setShowMap(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        handleGetLocation(latitude, longitude);
      });
    }
  }, []);

  const handleGetLocation = async (lat: number, lng: number) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    if (data && data.display_name) {
      setUbicacion(data.display_name);
    } else {
      console.error("Error obteniendo la dirección.");
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        handleGetLocation(latitude, longitude);
      }, error => {
        console.error("Error obteniendo la ubicación:", error);
      });
    } else {
      console.error("La geolocalización no es compatible con este navegador.");
    }
  };

  const handleSubmit = () => {
    onSubmit(denunciante, hora, ubicacion, fecha);
    onClose();
  };

  return (
    <div className={isOpen ? style.modalOverlay : style.hidden}>
      <div className={style.modal}>
        <h2>Datos del Denunciante</h2>
        <label>
          Nombre:
          <input type="text" value={denunciante} onChange={(e) => setDenunciante(e.target.value)} />
        </label>
        <label>
          Hora:
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </label>
        <label>
          Fecha:
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label>
          Ubicación:
          <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
        </label>
        <div className={style.mapButtons}>
          <button onClick={handleGetCurrentLocation}>Obtener Dirección Actual</button>
          <button onClick={() => setShowMap(!showMap)}>
            {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
          </button>
        </div>
        {showMap && <LocationPicker initialCoordinates={coordinates} onLocationSelect={handleGetLocation} />}
        <div className={style.actionButtons}>
          <button onClick={handleSubmit}>Enviar</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
