import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Spinner from '../components/Spinner';
import Alerta from '../components/alertas/Alerta';
import useAuth from '../hooks/useAuth';
import '../styles/evento-detail.css';

// Función para formatear fecha
const formatearFecha = fecha => {
  if (!fecha) return '';
  
  const fechaNueva = new Date(fecha);
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return fechaNueva.toLocaleDateString('es-ES', opciones);
};

export default function EventoDetail() {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  const [reservando, setReservando] = useState(false);
  
  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        setCargando(true);
        setAlerta({});
        
        // Obtener los datos del evento
        const { data } = await clienteAxios.get(`/api/eventos/${id}`);
        
        if (data) {
          console.log('Evento cargado:', data);
          setEvento(data);
        }
      } catch (error) {
        console.error('Error al cargar el evento:', error);
        setAlerta({
          tipo: 'error',
          mensaje: 'No se pudo cargar la información del evento'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerEvento();
  }, [id]);

  const handleReservar = async () => {
    if (!auth?.id) {
      navigate('/login', { 
        state: { 
          mensaje: 'Necesitas iniciar sesión para reservar',
          redirigirA: `/eventos/${id}`
        } 
      });
      return;
    }
    
    setReservando(true);
    
    try {
      const { data } = await clienteAxios.post('/api/eventos/reservar', {
        evento_id: id
      });
      
      if (data.error) {
        setAlerta({
          tipo: 'error',
          mensaje: data.msg
        });
        setReservando(false);
        return;
      }
      
      setAlerta({
        tipo: 'exito',
        mensaje: 'Evento reservado correctamente'
      });
      
      // Actualizar el evento para reflejar un lugar menos
      setEvento({
        ...evento,
        disponibles: evento.disponibles - 1
      });
      
      // Después de 3 segundos, redirigir a la página de eventos
      setTimeout(() => {
        navigate('/eventos');
      }, 3000);
      
    } catch (error) {
      setAlerta({
        tipo: 'error',
        mensaje: error.response?.data?.msg || 'Error al reservar el evento'
      });
    } finally {
      setReservando(false);
    }
  };
  
  if (cargando) return <Spinner />;
  
  if (!evento) {
    return (
      <div className="evento-no-encontrado">
        <Alerta 
          tipo="error"
          mensaje={alerta.mensaje || "Evento no encontrado"}
        />
        <div className="evento-no-encontrado__accion">
          <Link
            to="/eventos"
            className="evento-no-encontrado__enlace"
          >
            Volver a Eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="evento-detalle">
      {alerta.mensaje && (
        <Alerta 
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      <div className="evento-detalle__hero">
        <div className={`evento-detalle__categoria evento-detalle__categoria--${evento.categoria?.id || 0}`}></div>
        <h1 className="evento-detalle__nombre">{evento.nombre}</h1>
      </div>
      
      <div className="evento-detalle__grid">
        <div className="evento-detalle__informacion">
          <div className="evento-detalle__datos">
            <p className="evento-detalle__fecha">
              <span className="evento-detalle__label">Día:</span> 
              {evento.dia?.nombre} - {evento.dia?.fecha && formatearFecha(evento.dia.fecha)}
            </p>
            <p className="evento-detalle__hora">
              <span className="evento-detalle__label">Hora:</span> 
              {evento.hora?.hora}
            </p>
            <p className="evento-detalle__categoria-texto">
              <span className="evento-detalle__label">Categoría:</span> 
              {evento.categoria?.nombre}
            </p>
          </div>
          
          <div className="evento-detalle__descripcion">
            <h2 className="evento-detalle__heading">Sobre este evento:</h2>
            <p className="evento-detalle__texto">{evento.descripcion}</p>
          </div>
          
          <div className="evento-detalle__disponibilidad">
            {evento.disponibles > 0 ? (
              <p className="evento-detalle__disponibles evento-detalle__disponibles--positivo">
                ¡Aún quedan <span>{evento.disponibles}</span> lugares disponibles!
              </p>
            ) : (
              <p className="evento-detalle__disponibles evento-detalle__disponibles--negativo">
                No hay lugares disponibles
              </p>
            )}
          </div>
        </div>
        
        <div className="evento-detalle__ponente">
          {evento.ponente && (
            <div className="evento-detalle__ponente-info">
              <h2 className="evento-detalle__heading">Presentado por:</h2>
              
              <div className="evento-detalle__ponente-card">
                <div className="evento-detalle__ponente-imagen">
  <img 
    src={
      evento.ponente.imagen === 'default_speaker' ? 
      '/speakers/default_speaker.png' : 
      `/speakers/${evento.ponente.imagen}`
    }
    alt={`${evento.ponente.nombre} ${evento.ponente.apellido}`}
    onError={(e) => {
      if (e.target.src.includes('.jpg')) {
        e.target.src = `/speakers/${evento.ponente.imagen}.png`;
      } else if (e.target.src.includes('.png')) {
        e.target.src = `/speakers/${evento.ponente.imagen}.webp`;
      } else {
        e.target.src = '/speakers/default_speaker.png';
      }
    }}
    className="evento-detalle__ponente-img"
  />
</div>
                <div className="evento-detalle__ponente-contenido">
                  <h3 className="evento-detalle__ponente-nombre">
                    {evento.ponente.nombre} {evento.ponente.apellido || ''}
                  </h3>
                  {evento.ponente.ciudad && evento.ponente.pais && (
                    <p className="evento-detalle__ponente-ubicacion">
                      {evento.ponente.ciudad}, {evento.ponente.pais}
                    </p>
                  )}
                  <Link to={`/ponentes/${evento.ponente.id}`} className="evento-detalle__ponente-enlace">
                    Ver perfil completo
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="evento-detalle__acciones">
      <Link to="/eventos" className="evento-detalle__volver">
        &larr; Volver a Eventos
      </Link>
      
      {evento.disponibles > 0 && (
        <button 
          className="evento-detalle__registrar"
          onClick={handleReservar}
          disabled={reservando}
        >
          {reservando ? 'Procesando...' : 'Reservar mi lugar'}
        </button>
      )}
    </div>
    </main>
  );
}