import { useState, useEffect } from 'react';
import { clienteAxios } from '../config/axios';
import Spinner from '../components/Spinner';
import Alerta from '../components/alertas/Alerta';
import EventoCard from '../components/EventoCard';
import Paginacion from '../components/Paginacion';
import '../styles/eventos.css';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});
  
  // Estados para filtros
  const [categorias, setCategorias] = useState([]);
  const [dias, setDias] = useState([]);
  const [filtros, setFiltros] = useState({
    categoria: '',
    dia: ''
  });
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [eventosPerPage] = useState(9);
  
  // Cargar los filtros (categorías y días)
  useEffect(() => {
    const cargarFiltros = async () => {
  try {
    const [categoriasResponse, diasResponse] = await Promise.all([
      clienteAxios.get('/api/categorias'),
      clienteAxios.get('/api/dias')
    ]);
    
    // Manejar la respuesta de categorías correctamente
    if (categoriasResponse.data) {
      console.log("Categorías cargadas:", categoriasResponse.data);
      
      // Verificar si la respuesta es un objeto con propiedad 'categorias'
      if (categoriasResponse.data.categorias && Array.isArray(categoriasResponse.data.categorias)) {
        setCategorias(categoriasResponse.data.categorias);
      } 
      // Verificar si la respuesta es directamente un array
      else if (Array.isArray(categoriasResponse.data)) {
        setCategorias(categoriasResponse.data);
      } 
      else {
        console.error("Formato de categorías inesperado:", categoriasResponse.data);
        setCategorias([]);
      }
    }
    
    // Manejar la respuesta de días correctamente
    if (diasResponse.data) {
      console.log("Días cargados:", diasResponse.data);
      
      // Verificar si la respuesta es un objeto con propiedad 'dias'
      if (diasResponse.data.dias && Array.isArray(diasResponse.data.dias)) {
        setDias(diasResponse.data.dias);
      } 
      // Verificar si la respuesta es directamente un array
      else if (Array.isArray(diasResponse.data)) {
        setDias(diasResponse.data);
      } 
      else {
        console.error("Formato de días inesperado:", diasResponse.data);
        setDias([]);
      }
    }
  } catch (error) {
    console.error("Error al cargar filtros:", error);
    setCategorias([]);
    setDias([]);
  }
};
    
    cargarFiltros();
  }, []);
  
  // Cargar eventos con filtros y paginación
  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        setCargando(true);
        
        // Construir parámetros para la solicitud
        const params = {
          page: paginaActual,
          limit: eventosPerPage
        };
        
        // Añadir filtros si están seleccionados
        if (filtros.categoria) {
          params.categoria_id = filtros.categoria;
        }
        
        if (filtros.dia) {
          params.dia_id = filtros.dia;
        }
        
        // Obtener eventos
        const { data } = await clienteAxios.get('/api/eventos', { params });
        
        if (data) {
          // Si la respuesta es un objeto con eventos y paginación
          if (data.eventos && Array.isArray(data.eventos)) {
            console.log("Eventos cargados:", data.eventos.length);
            setEventos(data.eventos);
            
            // Configurar paginación si existe
            if (data.paginacion) {
              setTotalPaginas(data.paginacion.totalPaginas || 1);
            }
          } 
          // Si la respuesta es directamente un array de eventos
          else if (Array.isArray(data)) {
            console.log("Eventos cargados (formato array):", data.length);
            setEventos(data);
            
            // Calcular paginación manualmente
            const totalEventos = data.length;
            setTotalPaginas(Math.ceil(totalEventos / eventosPerPage));
            
            // Filtrar solo los eventos de la página actual
            const inicio = (paginaActual - 1) * eventosPerPage;
            const fin = inicio + eventosPerPage;
            setEventos(data.slice(inicio, fin));
          } 
          else {
            console.error("Formato de respuesta incorrecto:", data);
            setAlerta({
              tipo: 'error',
              mensaje: 'Error al cargar los eventos'
            });
            setEventos([]);
          }
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        setAlerta({
          tipo: 'error',
          mensaje: 'Error al cargar los eventos'
        });
        setEventos([]);
      } finally {
        setCargando(false);
      }
    };
    
    obtenerEventos();
  }, [paginaActual, filtros, eventosPerPage]);
  
  // Filtrar eventos según los filtros seleccionados
  const eventosFiltrados = eventos;
  
  // Manejar cambio de filtros
  const handleFiltroChange = (e) => {
    // Al cambiar un filtro, volver a la primera página
    setPaginaActual(1);
    
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };
  
  // Limpiar filtros
  const limpiarFiltros = () => {
    setPaginaActual(1);
    setFiltros({
      categoria: '',
      dia: ''
    });
  };
  
  // Manejar cambio de página
  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo(0, 0);
  };
  
  if (cargando) return <Spinner />;
  
  return (
    <main className="eventos">
      <h2 className="eventos__heading">Agenda de Eventos</h2>
      <p className="eventos__descripcion">
        Talleres, conferencias y más actividades para DevCommit
      </p>
      
      {alerta.mensaje && (
        <Alerta
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      {/* Filtros */}
      <div className="eventos__filtros">
        <div className="filtros">
          <h3 className="filtros__heading">Filtrar Eventos</h3>
          
          <div className="filtros__grid">
            {/* Filtro por categoría */}
            <div className="filtro">
              <label htmlFor="categoria" className="filtro__label">Categoría:</label>
              <select 
                id="categoria"
                name="categoria"
                className="filtro__select"
                value={filtros.categoria}
                onChange={handleFiltroChange}
              >
                <option value="">-- Todas --</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtro por día */}
            <div className="filtro">
              <label htmlFor="dia" className="filtro__label">Día:</label>
              <select 
                id="dia"
                name="dia"
                className="filtro__select"
                value={filtros.dia}
                onChange={handleFiltroChange}
              >
                <option value="">-- Todos --</option>
                {dias.map(dia => (
                  <option key={dia.id} value={dia.id}>
                    {dia.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Botón para limpiar filtros */}
            <button
              type="button"
              className="filtros__submit"
              onClick={limpiarFiltros}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
      
      {/* Lista de eventos */}
      <div className="eventos__listado">
        {eventosFiltrados.length === 0 ? (
          <p className="eventos__no-eventos">
            No hay eventos disponibles con los filtros seleccionados.
          </p>
        ) : (
          <>
            <div className="eventos__grid">
              {eventosFiltrados.map(evento => (
                <EventoCard 
                  key={evento.id || Math.random().toString(36).substring(2, 9)}
                  evento={evento}
                />
              ))}
            </div>
            
            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="eventos__paginacion">
                <Paginacion 
                  paginaActual={paginaActual} 
                  totalPaginas={totalPaginas}
                  onChange={cambiarPagina}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}