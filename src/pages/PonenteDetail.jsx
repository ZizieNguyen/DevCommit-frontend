import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Spinner from '../components/Spinner';
import Alerta from '../components/alertas/Alerta';
import '../styles/ponente-detail.css';

// Función para formatear fecha
const formatearFecha = fecha => {
  const fechaNueva = new Date(fecha);
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return fechaNueva.toLocaleDateString('es-ES', opciones);
};

export default function PonenteDetail() {
  const { id } = useParams();
  
  const [ponente, setPonente] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);
        setAlerta({});
        
        console.log(`Obteniendo datos del ponente ID:`, id);
        
        // Validar que el ID sea un número válido
        if (!id || id === 'undefined' || id === 'null') {
          throw new Error("ID no válido");
        }
        
        // Obtener el ponente directamente por su ID
        try {
          const { data: ponenteData } = await clienteAxios.get(`/api/ponente/${id}`);
          
          if (ponenteData && !ponenteData.error) {
            console.log("Ponente encontrado:", ponenteData);
            setPonente(ponenteData);
            
            // Intentar cargar eventos relacionados con el ponente
            try {
              const { data: eventosData } = await clienteAxios.get('/api/eventos-ponente', {
                params: { ponente_id: id }
              });
              
              if (Array.isArray(eventosData) && eventosData.length > 0) {
                console.log("Eventos encontrados:", eventosData.length);
                setEventos(eventosData);
              } else {
                console.log("No se encontraron eventos para este ponente");
                setEventos([]);
              }
            } catch (errorEventos) {
              console.error("Error al cargar eventos:", errorEventos);
              setEventos([]);
            }
          } else {
            throw new Error(ponenteData?.msg || "Ponente no encontrado");
          }
        } catch (error) {
          console.error("Error al cargar el ponente:", error);
          throw new Error("No se pudo encontrar el ponente solicitado");
        }
        
      } catch (error) {
        console.error("Error al cargar el ponente:", error);
        setAlerta({
          tipo: 'error',
          mensaje: error.message || 'No se encontró información del ponente solicitado'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerDatos();
  }, [id]);
  
  // Función para generar biografía
  const generarBiografia = (ponente) => {
    if (!ponente) return '';
    
    let especialidades = ponente.tags ? 
      ponente.tags.split(',').map(tag => tag.trim()).join(', ') : 
      'tecnología';
      
    return `${ponente.nombre} ${ponente.apellido} es un destacado profesional en el campo de ${especialidades}. Actualmente reside en ${ponente.ciudad}, ${ponente.pais} y participa como ponente en conferencias y eventos de tecnología.`;
  };
  
  // Función para manejar errores de carga de imágenes
  const manejarErrorImagen = (e, ponente) => {
    console.log(`Error cargando imagen: ${e.target.src}`);
    
    // Verificar si es default_speaker sin extensión
    if (e.target.src.includes('.jpg')) {
    e.target.src = `/speakers/${ponente.imagen}.png`;
  } else if (e.target.src.includes('.png')) {
    e.target.src = `/speakers/${ponente.imagen}.webp`;
  } else {
    e.target.src = '/speakers/default_speaker.png';
  }
};
  
  if (cargando) return <Spinner />;
  
  if (!ponente) {
    return (
      <div className="ponente-no-encontrado">
        <Alerta 
          tipo="error"
          mensaje="Ponente no encontrado"
        />
        <div className="ponente-no-encontrado__accion">
          <Link
            to="/ponentes"
            className="ponente-no-encontrado__enlace"
          >
            Volver a Ponentes
          </Link>
        </div>
      </div>
    );
  }
  
  // Parsear las redes sociales
  let redesObj = {};
  try {
    redesObj = typeof ponente.redes === 'string' 
      ? JSON.parse(ponente.redes) 
      : (ponente.redes || {});
  } catch (error) {
    console.error("Error al parsear redes sociales:", error);
  }
  
  return (
    <main className="ponente-detalle">
      {alerta.mensaje && (
        <Alerta 
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      {/* Perfil del ponente */}
      <div className="ponente-card">
        <div className="ponente-card__contenido">
          <div className="ponente-card__imagen">
            <img 
  src={
    ponente.imagen === 'default_speaker' ? 
    '/speakers/default_speaker.png' : 
    `/speakers/${ponente.imagen}`
  }
  alt={`${ponente.nombre} ${ponente.apellido}`}
  onError={(e) => manejarErrorImagen(e, ponente)}
  className="ponente-card__img"
/>
          </div>
          <div className="ponente-card__info">
            <div className="ponente-card__header">
              <div>
                <h1 className="ponente-card__nombre">
                  {ponente.nombre} {ponente.apellido}
                </h1>
                <p className="ponente-card__ubicacion">{ponente.ciudad}, {ponente.pais}</p>
              </div>
              <Link 
                to="/ponentes" 
                className="ponente-card__volver"
              >
                &larr; Volver
              </Link>
            </div>
            
            {ponente.tags && (
              <div className="ponente-card__especialidades">
                <h3 className="ponente-card__subtitulo">Especialidades:</h3>
                <div className="ponente-card__tags">
                  {ponente.tags.split(',').map((tag, index) => (
                    <span 
                      key={`tag-${index}`}
                      className="ponente-card__tag"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="ponente-card__biografia">
              <h3 className="ponente-card__subtitulo">Biografía:</h3>
              <p className="ponente-card__texto">
                {ponente.biografia || generarBiografia(ponente)}
              </p>
            </div>
            
            {redesObj && Object.values(redesObj).some(red => red) && (
              <div className="ponente-card__redes">
                <h3 className="ponente-card__subtitulo">Redes Sociales:</h3>
                <div className="ponente-card__enlaces">
                  {redesObj.facebook && (
                    <a 
                      href={`https://facebook.com/${redesObj.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--facebook"
                    >
                      Facebook
                    </a>
                  )}
                  {redesObj.twitter && (
                    <a 
                      href={`https://twitter.com/${redesObj.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--twitter"
                    >
                      Twitter
                    </a>
                  )}
                  {redesObj.youtube && (
                    <a 
                      href={`https://youtube.com/${redesObj.youtube}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--youtube"
                    >
                      YouTube
                    </a>
                  )}
                  {redesObj.instagram && (
                    <a 
                      href={`https://instagram.com/${redesObj.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--instagram"
                    >
                      Instagram
                    </a>
                  )}
                  {redesObj.tiktok && (
                    <a 
                      href={`https://tiktok.com/@${redesObj.tiktok}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--tiktok"
                    >
                      TikTok
                    </a>
                  )}
                  {redesObj.github && (
                    <a 
                      href={`https://github.com/${redesObj.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ponente-card__red ponente-card__red--github"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Eventos del ponente */}
      <div className="eventos-ponente">
        <h2 className="eventos-ponente__heading">Eventos con {ponente.nombre}</h2>
        
        {!Array.isArray(eventos) || eventos.length === 0 ? (
          <p className="eventos-ponente__no-eventos">
            Este ponente no tiene eventos programados actualmente.
          </p>
        ) : (
          <div className="eventos-ponente__grid">
            {eventos.map(evento => (
              <div 
                key={`evento-${evento.id || Math.random().toString(36).substr(2, 9)}`}
                className="evento-card"
              >
                <div className={`evento-card__categoria evento-card__categoria--${evento.categoria_id}`}></div>
                <div className="evento-card__contenido">
                  <span className="evento-card__tipo">
                    {evento.categoria?.nombre}
                  </span>
                  <h3 className="evento-card__nombre">{evento.nombre}</h3>
                  
                  <div className="evento-card__fecha">
                    <span>
                      {evento.dia?.fecha && formatearFecha(evento.dia.fecha)} - {evento.hora?.hora}
                    </span>
                  </div>
                  
                  <p className="evento-card__descripcion">
                    {evento.descripcion}
                  </p>
                  
                  {/* Plazas disponibles */}
                  <div className="evento-card__disponibles">
                    {evento.disponibles > 0 ? (
                      <span className="evento-card__disponibles--positivo">
                        {evento.disponibles} plazas disponibles
                      </span>
                    ) : (
                      <span className="evento-card__disponibles--negativo">
                        Sin plazas disponibles
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/eventos/${evento.id}`}
                    className="evento-card__enlace"
                  >
                    Ver detalles &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}