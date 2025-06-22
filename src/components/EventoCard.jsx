import { Link } from 'react-router-dom';

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

// Nueva función para obtener la URL de la imagen
const getImageUrl = (ponente) => {
  if (!ponente || !ponente.imagen) {
    return '/speakers/default_speaker.png';
  }
  
  if (ponente.imagen === 'default_speaker') {
    return '/speakers/default_speaker.png';
  }
  
  return `/speakers/${ponente.imagen}`;
};

const EventoCard = ({ evento, compact }) => {
  // Obtener la categoría para el color
  const categoriaId = evento.categoria?.id || 0;
  
  return (
    <div className={`evento-card ${compact ? 'evento-card--compacto' : ''}`}>
      <div className={`evento-card__categoria evento-card__categoria--${categoriaId}`}></div>
      <div className="evento-card__contenido">
        {/* Estructura condicional para mostrar contenido diferente en modo compacto */}
        {compact ? (
          // Versión compacta
          <>
            <div className="evento-card__header">
              <p className="evento-card__fecha">
                <span className="evento-card__dia">{evento.dia?.nombre || 'Próximamente'}</span>
              </p>
              <p className="evento-card__categoria-texto">{evento.categoria?.nombre}</p>
            </div>
            
            <h3 className="evento-card__nombre">{evento.nombre}</h3>
            <p className="evento-card__descripcion">{evento.descripcion}</p>
            
            {evento.ponente && (
              <div className="evento-card__autor-compacto">
                <img 
                  src={getImageUrl(evento.ponente)}
                  alt={`${evento.ponente.nombre} ${evento.ponente.apellido}`}
                  onError={(e) => {
                    // Si falla la imagen, intentar variaciones o usar default
                    if (e.target.src.includes('.jpg')) {
                      e.target.src = `/speakers/${evento.ponente.imagen}.png`;
                    } else if (e.target.src.includes('.png')) {
                      e.target.src = `/speakers/${evento.ponente.imagen}.webp`;
                    } else {
                      e.target.src = '/speakers/default_speaker.png';
                    }
                  }}
                  className="evento-card__autor-imagen-compacto"
                />
                <span>{evento.ponente.nombre} {evento.ponente.apellido}</span>
              </div>
            )}
            
            <div className="evento-card__footer">
              <p className="evento-card__disponibles">
                <span className="evento-card__disponibles-cantidad">{evento.disponibles}</span> plazas
              </p>
              <Link to={`/eventos/${evento.id}`} className="evento-card__enlace evento-card__enlace--compacto">
                Ver Detalles
              </Link>
            </div>
          </>
        ) : (
          // Versión normal (código original)
          <>
            <p className="evento-card__fecha">
              <span className="evento-card__dia">{evento.dia?.nombre}</span> 
              {evento.dia?.fecha && <span> {formatearFecha(evento.dia.fecha)}</span>}
              {evento.hora?.hora && <span> - {evento.hora.hora}</span>}
            </p>
            <h3 className="evento-card__nombre">{evento.nombre}</h3>
            <p className="evento-card__descripcion">{evento.descripcion}</p>
            
            {evento.ponente && (
              <div className="evento-card__autor">
                <div className="evento-card__autor-imagen">
                  <img 
                    src={getImageUrl(evento.ponente)}
                    alt={`${evento.ponente.nombre} ${evento.ponente.apellido}`}
                    onError={(e) => {
                      // Si falla la imagen, intentar variaciones o usar default
                      if (e.target.src.includes('.jpg')) {
                        e.target.src = `/speakers/${evento.ponente.imagen}.png`;
                      } else if (e.target.src.includes('.png')) {
                        e.target.src = `/speakers/${evento.ponente.imagen}.webp`;
                      } else {
                        e.target.src = '/speakers/default_speaker.png';
                      }
                    }}
                  />
                </div>
                <p>
                  Por: {evento.ponente.nombre} {evento.ponente.apellido}
                </p>
              </div>
            )}
            
            <div className="evento-card__footer">
              <p className="evento-card__categoria-texto">{evento.categoria?.nombre}</p>
              <p className="evento-card__disponibles">
                <span>{evento.disponibles}</span> lugares disponibles
              </p>
            </div>
            
            <Link to={`/eventos/${evento.id}`} className="evento-card__enlace">
              Ver Detalles
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default EventoCard;