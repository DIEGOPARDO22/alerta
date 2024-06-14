import React, { useState, useEffect } from 'react';
import style from './ReportModal.module.css';
import dynamic from 'next/dynamic';
import { FaSearch } from 'react-icons/fa';

// Importar dinámicamente el componente LocationPicker
const LocationPicker = dynamic(() => import('./LocationPicker'), { ssr: false });

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (denunciante: string, hora: string, ubicacion: string, fecha: string, callback: () => void) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [denunciante, setDenunciante] = useState('');
  const [hora, setHora] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fecha, setFecha] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [dni, setDni] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDenunciante('');
      setHora('');
      setUbicacion('');
      setFecha('');
      setCoordinates(null);
      setShowMap(false);
      setDni('');
      setNombres('');
      setApellidoPaterno('');
      setApellidoMaterno('');
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

  const handleSearchDni = async () => {
    if (dni.length !== 8) {
      alert('El DNI debe tener 8 dígitos');
      return;
    }

    try {
      const response = await fetch(`/api/reniec/dni?numero=${dni}`, {
        headers: {
          'Authorization': 'apis-token-9014.FI7CXJ2pZFNNcCJbdzEzAi48uh0eTKXC'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener datos del DNI');
      }

      const data = await response.json();
      setNombres(`${data.apellidoPaterno} ${data.apellidoMaterno}, ${data.nombres}`);
      setApellidoPaterno(data.apellidoPaterno);
      setApellidoMaterno(data.apellidoMaterno);
      setDenunciante(`${data.apellidoPaterno} ${data.apellidoMaterno}, ${data.nombres}`);
    } catch (error) {
      console.error('Error al obtener datos del DNI:', error);
    }
  };

  const handleSubmit = async () => {
    if (!denunciante || !hora || !ubicacion || !fecha || !nombres || !apellidoPaterno || !apellidoMaterno) {
      alert('Por favor, complete todos los campos antes de enviar.');
      return;
    }

    const reportData = {
      denunciante,
      hora,
      ubicacion,
      fecha,
    };

    try {
      onSubmit(denunciante, hora, ubicacion, fecha, () => {
        const mensaje = `Datos del desaparecido:\nNombre: Juan Pérez\nEdad: 10 años\nFecha de desaparición: 01/06/2024\nÚltima ubicación conocida: Parque Central\n\nDatos del denunciante:\nNombre: ${denunciante}\nHora: ${hora}\nUbicación: ${ubicacion}\nFecha: ${fecha}`;
        const whatsappUrl = `https://wa.me/51984253341?text=${encodeURIComponent(mensaje)}`;
        if (typeof window !== 'undefined') {
          window.open(whatsappUrl, '_blank');
        } else {
          console.error('window object is not available');
        }
      });
      onClose();
    } catch (error) {
      console.error('Error submitting the report:', error);
    }
  };

  return (
    <div className={isOpen ? style.modalOverlay : style.hidden}>
      <div className={style.modal}>
        <h2>Datos del Denunciante</h2>
        <label>
          DNI:
          <input type="text" value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))} maxLength={8} />
          <button onClick={handleSearchDni}>
            <FaSearch />
          </button>
        </label>
        <label>
          Nombre:
          <input type="text" value={denunciante} onChange={(e) => setDenunciante(e.target.value)} readOnly />
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