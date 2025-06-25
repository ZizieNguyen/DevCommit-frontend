import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCode, FaUsers, FaMicrophone, FaTemperatureHigh, FaWind, FaSun, FaCloud } from 'react-icons/fa';
import { clienteAxios } from '../config/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import EventoCard from '../components/EventoCard';
// Importaciones para el mapa
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Importar estilos de Swiper y Leaflet
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'leaflet/dist/leaflet.css';
import '../styles/inicio.css';

// Componente de Spinner simple
const Spinner = () => (
  <div className="spinner">
    <div className="spinner__contenedor">
      <div className="spinner__circulo"></div>
    </div>
  </div>
);

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Componente PonenteCard simple
const PonenteCard = ({ ponente }) => {
  // Determinar la URL de imagen correcta para la nueva ubicación
  const getImageUrl = () => {
    if (!ponente.imagen || ponente.imagen === 'default_speaker') {
      return `/speakers/default_speaker.png`;
    }
    
    // Intentar con extensión jpg primero
    return `/speakers/${ponente.imagen}`;
  };

  return (
    <div className="ponente">
      <div className="ponente__imagen">
        <img 
          src={getImageUrl()}
          alt={`${ponente.nombre} ${ponente.apellido}`}
          onError={(e) => {
            // Si falla la imagen, intentar variaciones o usar default
            if (e.target.src.includes('.jpg')) {
              e.target.src = `/speakers/${ponente.imagen}.png`;
            } else if (e.target.src.includes('.png')) {
              e.target.src = `/speakers/${ponente.imagen}.webp`;
            } else {
              e.target.src = `/speakers/default_speaker.png`;
            }
          }}
          className="ponente__img"
        />
      </div>
      <div className="ponente__contenido">
        <h3 className="ponente__nombre">{ponente.nombre} {ponente.apellido}</h3>
        <p className="ponente__ubicacion">{ponente.ciudad}, {ponente.pais}</p>
        
        {ponente.tags && (
          <div className="ponente__tags">
            {ponente.tags.split(',').map((tag, index) => (
              <span key={`${ponente.id || index}-tag-${index}`} className="ponente__tag">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function HomePage() {
  const [eventos, setEventos] = useState([]);
  const [ponentes, setPonentes] = useState([]);
  const [stats, setStats] = useState({
    eventos: 0,
    categorias: 0,
    ponentes: 0,
    asistentes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clima, setClima] = useState(null);

  // API PÚBLICA 1: Open-Meteo para el clima
  useEffect(() => {
    // Coordenadas de Madrid
    const lat = 40.4168;
    const lon = -3.7038;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`)
      .then(res => res.json())
      .then(data => {
        if (data.current) {
          setClima({
            temperature: data.current.temperature_2m,
            weathercode: data.current.weathercode,
            windspeed: data.current.windspeed_10m
          });
        }
      })
      .catch(() => setClima(null));
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar eventos desde la API
        try {
          const { data: eventosData } = await clienteAxios.get('/api/eventos?limit=6');
          
          if (eventosData) {
            console.log('Datos de eventos recibidos:', eventosData);
            
            // Si la respuesta tiene formato {eventos: Array(), paginacion: {...}}
            if (eventosData.eventos && Array.isArray(eventosData.eventos)) {
              console.log('Eventos cargados correctamente:', eventosData.eventos.length);
              setEventos(eventosData.eventos);
            } 
            // Si la respuesta es directamente un array
            else if (Array.isArray(eventosData)) {
              console.log('Eventos cargados como array:', eventosData.length);
              setEventos(eventosData);
            } 
            else {
              console.warn('Formato de respuesta de eventos inesperado:', eventosData);
              setEventos([]);
            }
          }
        } catch (errorEventos) {
          console.error('Error cargando eventos:', errorEventos);
          setEventos([]);
        }
        
        // 2. Cargar ponentes desde la API
        try {
          const { data: ponentesData } = await clienteAxios.get('/api/ponentes?limite=8');
          
          if (ponentesData && ponentesData.ponentes && Array.isArray(ponentesData.ponentes)) {
            console.log('Ponentes cargados correctamente:', ponentesData.ponentes.length);
            setPonentes(ponentesData.ponentes);
          } else if (Array.isArray(ponentesData)) {
            setPonentes(ponentesData);
          } else {
            console.warn('Formato de respuesta de ponentes inesperado:', ponentesData);
            setPonentes([]);
          }
        } catch (errorPonentes) {
          console.error('Error cargando ponentes:', errorPonentes);
          setPonentes([]);
        }
        
        // 3. Cargar estadísticas
        try {
          const { data: statsData } = await clienteAxios.get('/api/estadisticas');
          
          if (statsData && typeof statsData === 'object') {
            setStats({
              eventos: statsData.total_eventos || 30,
              categorias: statsData.total_categorias || 15,
              ponentes: statsData.total_ponentes || 36,
              asistentes: statsData.total_registros || 500
            });
          } else {
            setStats({
              eventos: 30,
              categorias: 15,
              ponentes: 36,
              asistentes: 500
            });
          }
        } catch (errorStats) {
          console.error('Error cargando estadísticas:', errorStats);
          setStats({
            eventos: 30,
            categorias: 15,
            ponentes: 36,
            asistentes: 500
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
        setError('Hubo un problema al cargar algunos datos. Mostrando información disponible.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('API URL fallback:', import.meta.env.VITE_API_URL || 'http://localhost:3000');

  return (
    <>
      {/* Sección Sobre DevCommit */}
      <section className="sobre-devcommit">
        <div className="contenedor">
          <h2 className="titulo">
            &#60;DevCommit&#62; - <span>La Conferencia para Desarrolladores</span>
          </h2>
          
          <div className="sobre-devcommit__grid">
            <div className="sobre-devcommit__imagen">
              <img src="/img/conferencia.jpg" alt="Sobre DevCommit" />
            </div>
            
            <div>
              <p className="sobre-devcommit__texto">
                DevCommit es el evento más importante para desarrolladores web y móvil en España. 
                Reunimos a los mejores expertos del sector para compartir conocimientos, inspirar y crear 
                conexiones valiosas en la comunidad tecnológica europea.
              </p>
              
              <p className="sobre-devcommit__texto">
                Durante dos días intensivos, podrás asistir a conferencias magistrales, talleres prácticos 
                y sesiones de networking que te ayudarán a impulsar tu carrera y mantenerte actualizado con 
                las últimas tendencias del desarrollo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="caracteristicas">
        <div className="contenedor">
          <h2 className="titulo">¿Por qué asistir a <span>DevCommit</span>?</h2>
          
          <div className="caracteristicas__grid">
            <div className="caracteristica">
              <div className="caracteristica__imagen">
                <img src="/img/icono_talleres.png" alt="Icono Talleres" />
              </div>
              <h3 className="caracteristica__titulo">Talleres & Workshops</h3>
              <p>Aprende con talleres prácticos impartidos por expertos en desarrollo que están creando el futuro de la web.</p>
            </div>

            <div className="caracteristica">
              <div className="caracteristica__imagen">
                <img src="/img/icono_conferencias.png" alt="Icono Conferencias" />
              </div>
              <h3 className="caracteristica__titulo">Conferencias</h3>
              <p>Asiste a las conferencias de nuestros expertos internacionales sobre las últimas tendencias en desarrollo.</p>
            </div>

            <div className="caracteristica">
              <div className="caracteristica__imagen">
                <img src="/img/icono_networking.png" alt="Icono Networking" />
              </div>
              <h3 className="caracteristica__titulo">Networking</h3>
              <p>Conoce a otros desarrolladores y expande tu red de contactos en los eventos sociales que organizamos.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Estadísticas */}
      <section className="numeros">
        <div className="contenedor">
          <div className="numeros__grid">
            <div className="numero">
              <FaCalendarAlt className="numero__icono" />
              <p className="numero__cantidad">{stats.eventos}</p>
              <p className="numero__texto">Eventos</p>
            </div>
            <div className="numero">
              <FaCode className="numero__icono" />
              <p className="numero__cantidad">{stats.categorias}</p>
              <p className="numero__texto">Categorías</p>
            </div>
            <div className="numero">
              <FaMicrophone className="numero__icono" />
              <p className="numero__cantidad">{stats.ponentes}</p>
              <p className="numero__texto">Ponentes</p>
            </div>
            <div className="numero">
              <FaUsers className="numero__icono" />
              <p className="numero__cantidad">{stats.asistentes}</p>
              <p className="numero__texto">Asistentes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos destacados */}
      <section id="eventos" className="eventos">
        <div className="contenedor">
          <h2 className="titulo">Próximos <span>Eventos</span></h2>
          <p className="eventos__descripcion">
            Descubre los workshops y conferencias impartidos por expertos que están transformando la industria
          </p>

          {error && (
            <div className="alerta alerta--error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="eventos__spinner">
              <Spinner />
            </div>
          ) : eventos.length > 0 ? (
            <div className="eventos__swiper">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  }
                }}
              >
                {eventos.map(evento => (
                  <SwiperSlide key={`evento-${evento.id}`}>
                    <div className="evento-homepage">
                      <EventoCard evento={evento} compact={true} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <p className="eventos__no-eventos">
              No hay eventos próximos disponibles en este momento.
            </p>
          )}

          <div className="eventos__enlace">
            <Link to="/eventos" className="boton">
              Ver Todos los Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Ponentes destacados */}
      <section className="ponentes">
        <div className="contenedor">
          <h2 className="titulo">Nuestros <span>Ponentes</span></h2>
          <p className="ponentes__descripcion">
            Conoce a los expertos de la industria que compartirán sus conocimientos en DevCommit
          </p>

          {loading ? (
            <div className="ponentes__spinner">
              <Spinner />
            </div>
          ) : ponentes.length > 0 ? (
            <div className="ponentes__swiper">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  }
                }}
              >
                {ponentes.map((ponente, index) => (
                  <SwiperSlide key={`ponente-${ponente.id || index}`}>
                    <PonenteCard ponente={ponente} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <p className="ponentes__no-ponentes">
              No hay ponentes disponibles en este momento.
            </p>
          )}

          <div className="ponentes__enlace">
            <Link to="/ponentes" className="boton">
              Ver Todos los Ponentes
            </Link>
          </div>
        </div>
      </section>

      {/* Boletos */}
      <section className="boletos">
        <div className="contenedor">
          <h2 className="titulo titulo--blanco">
            Boletos & Precios
          </h2>
          <p className="boletos__descripcion texto-blanco">
            Precios para DevCommit - Disponibles por tiempo limitado
          </p>
          
          <div className="boletos__grid">
            <div className="boleto boleto--presencial">
              <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
              <p className="boleto__plan">Presencial</p>
              <p className="boleto__precio">€99</p>
              <div className="boleto__enlace-contenedor">
                <Link to="/registro" className="boleto__enlace">
                  Comprar Pase
                </Link>
              </div>
            </div>

            <div className="boleto boleto--virtual">
              <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
              <p className="boleto__plan">Virtual</p>
              <p className="boleto__precio">€49</p>
              <div className="boleto__enlace-contenedor">
                <Link to="/registro" className="boleto__enlace">
                  Comprar Pase
                </Link>
              </div>
            </div>

            <div className="boleto boleto--gratis">
              <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
              <p className="boleto__plan">Gratis</p>
              <p className="boleto__precio">Gratis - €0</p>
              <div className="boleto__enlace-contenedor">
                <Link to="/registro" className="boleto__enlace">
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AQUÍ ESTÁN LAS DOS APIs PÚBLICAS: OpenStreetMap para el mapa y OpenMeteo para el clima */}
      <section className="mapa-clima-seccion">
        <div className="contenedor">
          <h2 className="titulo">
            Ubicación y Clima del <span>Evento</span>
          </h2>
          
          <div className="mapa-clima-contenedor">
            {/* API PÚBLICA 2: OpenStreetMap con Leaflet */}
            <div className="mapa">
              <MapContainer 
                center={[40.4168, -3.7038]} 
                zoom={15} 
                style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[40.4168, -3.7038]}>
                  <Popup>
                    <b>DevCommit 2025</b><br/>
                    Puerta del Sol, Madrid<br/>
                    5-6 de Octubre, 2025
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            
            {/* Datos del clima de la API de OpenMeteo */}
            <div className="clima">
              <h3 className="clima__titulo">Clima actual en Madrid</h3>
              
              {clima ? (
                <div className="clima__info">
                  <div className="clima__principal">
                    <FaTemperatureHigh className="clima__icono" />
                    <span className="clima__temperatura">{clima.temperature}°C</span>
                  </div>
                  
                  <div className="clima__detalles">
                    <div className="clima__detalle">
                      <FaWind className="clima__detalle-icono" />
                      <span>{clima.windspeed} km/h</span>
                    </div>
                    
                    {clima.weathercode <= 2 ? (
                      <div className="clima__detalle">
                        <FaSun className="clima__detalle-icono clima__detalle-icono--sol" />
                        <span>Soleado</span>
                      </div>
                    ) : (
                      <div className="clima__detalle">
                        <FaCloud className="clima__detalle-icono clima__detalle-icono--nube" />
                        <span>Nublado</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="clima__fuente">
                    <small>Datos proporcionados por <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo API</a></small>
                  </div>
                </div>
              ) : (
                <p className="clima__cargando">Cargando información del clima...</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}