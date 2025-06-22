import { useState, useEffect } from 'react';
import { clienteAxios } from "../../config/axios";

export default function FormularioEvento({ evento = {} }) {
  // Estados para los valores del formulario
  const [nombre, setNombre] = useState(evento.nombre || '');
  const [descripcion, setDescripcion] = useState(evento.descripcion || '');
  const [categoriaId, setCategoriaId] = useState(evento.categoria_id || '');
  const [diaId, setDiaId] = useState(evento.dia_id || '');
  const [horaId, setHoraId] = useState(evento.hora_id || '');
  const [ponenteId, setPonenteId] = useState(evento.ponente_id || '');
  const [disponibles, setDisponibles] = useState(evento.disponibles || '');
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para los datos obtenidos de la API
  const [categorias, setCategorias] = useState([]);
  const [dias, setDias] = useState([]);
  const [horas, setHoras] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState({});
  const [ponentes, setPonentes] = useState([]);
  const [ponentesFiltrados, setPonenteFiltrados] = useState([]);
  const [ponenteSeleccionado, setPonenteSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // Primer useEffect para cargar datos iniciales desde API
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        
        // Cargar datos de las APIs
        const [categoriasRes, diasRes, horasRes] = await Promise.all([
          clienteAxios('/api/categorias'),
          clienteAxios('/api/dias'),
          clienteAxios('/api/horas')
        ]);
        
        // Establecer estados con los datos recibidos
        setCategorias(categoriasRes.data?.categorias || []);
        setDias(diasRes.data?.dias || []);
        setHoras(horasRes.data?.horas || []);
        
        // Cargar todos los ponentes de todas las páginas
        await cargarTodosLosPonentes();
        
        // Si estamos editando y ya tenemos categoría y día, cargar horas disponibles
        if (Object.keys(evento).length > 0 && evento.categoria_id && evento.dia_id) {
          await buscarEventos(evento.dia_id, evento.categoria_id);
        }
        
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, []); // Solo se ejecuta al montar el componente
  
  // Segundo useEffect para actualizar el formulario cuando cambia el evento
  useEffect(() => {
    // Solo actualizar si hay datos en el evento (no es un objeto vacío)
    if (Object.keys(evento).length > 0) {
      console.log("Actualizando formulario con datos del evento:", evento);
      
      // Actualizar todos los estados con los valores del evento
      setNombre(evento.nombre || '');
      setDescripcion(evento.descripcion || '');
      setCategoriaId(evento.categoria_id || '');
      setDiaId(evento.dia_id || '');
      setHoraId(evento.hora_id || '');
      setDisponibles(evento.disponibles || '');
      
      // Actualizar el ID del ponente si existe
      if (evento.ponente_id) {
        setPonenteId(evento.ponente_id);
      }
      
      // Si el evento ya tiene un ponente asignado directamente
      if (evento.ponente) {
        console.log("Estableciendo ponente desde datos del evento:", evento.ponente);
        setPonenteSeleccionado(evento.ponente);
      }
      
      // Si tenemos categoría y día, buscar eventos para actualizar horas disponibles
      if (evento.categoria_id && evento.dia_id) {
        console.log("Buscando eventos para día y categoría del evento a editar");
        buscarEventos(evento.dia_id, evento.categoria_id);
      }
    }
  }, [evento]); // Este efecto se ejecuta cuando cambia el prop evento
  
  // Función para cargar todos los ponentes (posiblemente múltiples páginas)
  const cargarTodosLosPonentes = async () => {
    try {
      console.log("Iniciando carga de todos los ponentes");
      
      // Arreglo para almacenar todos los ponentes de todas las páginas
      let todosLosPonentes = [];
      
      // Iniciar en la página 1
      let paginaActual = 1;
      let hayMasPaginas = true;
      let ponentesPorPagina = 0;
      
      // Seguir cargando páginas mientras haya más
      while (hayMasPaginas) {
        console.log(`Cargando ponentes - página ${paginaActual}`);
        
        // Cargar la página actual
        const respuesta = await clienteAxios(`/api/ponentes?page=${paginaActual}`);
        
        // Extraer ponentes de esta página
        let ponentesDePagina = [];
        
        if (respuesta.data) {
          if (Array.isArray(respuesta.data)) {
            ponentesDePagina = respuesta.data;
          } else if (respuesta.data.ponentes && Array.isArray(respuesta.data.ponentes)) {
            ponentesDePagina = respuesta.data.ponentes;
          } else if (respuesta.data.data && Array.isArray(respuesta.data.data)) {
            ponentesDePagina = respuesta.data.data;
          }
        }
        
        // Si es la primera página, guardar cuántos ponentes hay por página normalmente
        if (paginaActual === 1) {
          ponentesPorPagina = ponentesDePagina.length;
          console.log(`Detectados ${ponentesPorPagina} ponentes por página`);
        }
        
        console.log(`Página ${paginaActual}: ${ponentesDePagina.length} ponentes encontrados`);
        
        todosLosPonentes = [...todosLosPonentes, ...ponentesDePagina];

        if (ponentesDePagina.length === 0 || 
            (ponentesPorPagina > 0 && ponentesDePagina.length < ponentesPorPagina)) {
          hayMasPaginas = false;
          console.log("No hay más páginas para cargar");
        } else {
          paginaActual++;
        }
      }
      
      console.log(`Carga completa. Total de ponentes cargados: ${todosLosPonentes.length}`);
      
      const ponentesFormateados = todosLosPonentes.map(ponente => {
        const nombreCompleto = `${ponente.nombre || ''} ${ponente.apellido || ''}`.trim();
        return {
          nombre: nombreCompleto,
          id: ponente.id,
          datos: ponente
        };
      });
      
      console.log("Todos los ponentes formateados:", ponentesFormateados);
      setPonentes(ponentesFormateados);
      
    } catch (error) {
      console.error("Error al cargar todos los ponentes:", error);
    }
  };
  
  // Función para buscar eventos por día y categoría
  const buscarEventos = async (diaId, categoriaId) => {
    try {
      const url = `/api/eventos-horario?dia_id=${diaId}&categoria_id=${categoriaId}`;
      const resultado = await clienteAxios(url);
      
      // Comprueba la estructura de la respuesta en la consola
      console.log('Respuesta de la API eventos-horario:', resultado);
      
      // Asegúrate de que datos sea siempre un array
      let eventos = [];
      if (resultado && resultado.data) {
        // Si la respuesta tiene una propiedad 'data'
        eventos = Array.isArray(resultado.data) ? resultado.data : [];
      }
      
      // Procesar las horas disponibles con el array garantizado
      obtenerHorasDisponibles(eventos);
    } catch (error) {
      console.error('Error al buscar eventos:', error);
      // En caso de error, considerar todas las horas como disponibles
      const disponibilidad = {};
      horas.forEach(hora => {
        disponibilidad[hora.id] = true;
      });
      setHorasDisponibles(disponibilidad);
    }
  };
  
  // Función para obtener horas disponibles a partir de los eventos
  const obtenerHorasDisponibles = (eventos) => {
    // Asegurarse que eventos es un array
    const eventosArray = Array.isArray(eventos) ? eventos : [];
    
    // Extraer IDs de horas ya tomadas
    const horasTomadas = eventosArray.map(evento => evento.hora_id);
    
    // Crear objeto con disponibilidad de horas
    const disponibilidad = {};
    horas.forEach(hora => {
      disponibilidad[hora.id] = !horasTomadas.includes(hora.id);
    });
    
    // Si estamos editando, siempre permitir la hora actual
    if (evento.id && evento.hora_id) {
      disponibilidad[evento.hora_id] = true;
    }
    
    setHorasDisponibles(disponibilidad);
  };
  
  // Función para manejar cambio de categoría
  const handleChangeCategoria = (e) => {
    const nuevaCategoriaId = e.target.value;
    setCategoriaId(nuevaCategoriaId);
    
    // Reiniciar hora seleccionada
    setHoraId('');
    
    // Si hay día seleccionado, buscar eventos disponibles
    if (diaId && nuevaCategoriaId) {
      buscarEventos(diaId, nuevaCategoriaId);
    }
  };
  
  // Función para manejar cambio de día
  const handleChangeDia = (id) => {
    setDiaId(id);
    
    // Reiniciar hora seleccionada
    setHoraId('');
    
    // Si hay categoría seleccionada, buscar eventos disponibles
    if (categoriaId && id) {
      buscarEventos(id, categoriaId);
    }
  };
  
  // Función para seleccionar hora
  const handleSeleccionarHora = (id) => {
    setHoraId(id);
  };
  
  // Efecto para filtrar ponentes localmente
  useEffect(() => {
    console.log("Filtrando ponentes con:", busqueda);
    console.log("Total de ponentes disponibles para filtrar:", ponentes.length);
    
    if (busqueda.length > 3 && ponentes.length > 0) {
      const terminoBusqueda = busqueda.toLowerCase().trim();
      
      const filtrados = ponentes.filter(ponente => 
        ponente.nombre.toLowerCase().includes(terminoBusqueda)
      );
      
      console.log(`Encontrados ${filtrados.length} ponentes que coinciden con "${terminoBusqueda}"`);
      setPonenteFiltrados(filtrados);
    } else {
      setPonenteFiltrados([]);
    }
  }, [busqueda, ponentes]);
  
  // Manejador de búsqueda
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };
  
  // Función para seleccionar ponente
  const handleSeleccionarPonente = (ponente) => {
    setPonenteId(ponente.id);
    setPonenteSeleccionado(ponente.datos);
    // Limpia la búsqueda para mejor UX
    setBusqueda('');
    setPonenteFiltrados([]);
  };
  
  if (cargando) {
    return <p className="text-center">Cargando formulario...</p>;
  }
  
  return (
    <>
      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Información Evento</legend>

        <div className="formulario__campo">
          <label htmlFor="nombre" className="formulario__label">Nombre Evento</label>
          <input
            type="text"
            className="formulario__input"
            id="nombre"
            name="nombre"
            placeholder="Nombre Evento"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="formulario__campo">
          <label htmlFor="descripcion" className="formulario__label">Descripción</label>
          <textarea
            className="formulario__input"
            id="descripcion"
            name="descripcion"
            placeholder="Descripción Evento"
            rows="8"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <div className="formulario__campo">
          <label htmlFor="categoria" className="formulario__label">Categoría o Tipo de Evento</label>
          <select
            className="formulario__select"
            id="categoria"
            name="categoria_id"
            value={categoriaId}
            onChange={handleChangeCategoria}
          >
            <option value="">- Seleccionar -</option>
            {Array.isArray(categorias) && categorias.map(categoria => (
              <option 
                key={categoria.id} 
                value={categoria.id}
              >
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>    

        <div className="formulario__campo">
          <label htmlFor="categoria" className="formulario__label">Selecciona el día</label>

          <div className="formulario__radio">
            {Array.isArray(dias) && dias.map(dia => (
              <div key={dia.id}>
                <label htmlFor={dia.nombre.toLowerCase()}>{dia.nombre}</label>
                <input
                  type="radio"
                  id={dia.nombre.toLowerCase()}
                  name="dia"
                  value={dia.id}
                  checked={Number(diaId) === Number(dia.id)}
                  onChange={() => handleChangeDia(dia.id)}
                />
              </div>
            ))}
          </div>

          <input 
            type="hidden" 
            name="dia_id" 
            value={diaId}
          />
        </div>

        <div id="horas" className="formulario__campo">
          <label className="formulario__label">Seleccionar Hora</label>

          <ul id="horas" className="horas">
            {Array.isArray(horas) && horas.map(hora => {
              // Determinar si la hora está disponible
              const disponible = horasDisponibles[hora.id];
              const seleccionada = Number(horaId) === Number(hora.id);
              
              // Determinar clases según disponibilidad y selección
              let claseHora = "horas__hora horas__hora--deshabilitada";
              if (disponible && seleccionada) {
                claseHora = "horas__hora horas__hora--seleccionada";
              } else if (disponible) {
                claseHora = "horas__hora";
              }
              
              return (
                <li 
                  key={hora.id}
                  data-hora-id={hora.id}
                  className={claseHora}
                  onClick={() => {
                    // Solo permitir clic si está disponible
                    if (disponible) {
                      handleSeleccionarHora(hora.id);
                    }
                  }}
                >
                  {hora.hora}
                </li>
              );
            })}
          </ul>

          <input 
            type="hidden" 
            name="hora_id" 
            value={horaId}
          />
        </div>
      </fieldset>

      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Información Extra</legend>

        <div className="formulario__campo">
          <label htmlFor="ponentes" className="formulario__label">Ponente</label>
          <input
            type="text"
            className="formulario__input"
            id="ponentes"
            placeholder="Buscar Ponente"
            value={busqueda}
            onChange={handleBusquedaChange}
          />
          
          {/* Mensaje de ayuda para la búsqueda */}
          {busqueda.length > 0 && busqueda.length <= 3 && (
            <p className="text-center">Escribe al menos 4 caracteres para buscar</p>
          )}
          
          <ul id="listado-ponentes" className="listado-ponentes">
            {ponentesFiltrados.length > 0 ? (
              ponentesFiltrados.map(ponente => (
                <li 
                  key={ponente.id} 
                  data-ponente-id={ponente.id}
                  className={`listado-ponentes__ponente ${ponenteId === ponente.id ? 'listado-ponentes__ponente--seleccionado' : ''}`}
                  onClick={() => handleSeleccionarPonente(ponente)}
                >
                  {ponente.nombre}
                </li>
              ))
            ) : (
              busqueda.length > 3 && (
                <p className="listado-ponentes__no-resultado">
                  No hay resultados para tu búsqueda
                </p>
              )
            )}
          </ul>

          {/* Mostrar ponente seleccionado cuando existe y no hay búsqueda */}
          {ponenteSeleccionado && !busqueda.length && (
            <p className="listado-ponentes__ponente listado-ponentes__ponente--seleccionado">
              {`${ponenteSeleccionado.nombre || ''} ${ponenteSeleccionado.apellido || ''}`.trim()}
            </p>
          )}

          <input 
            type="hidden" 
            name="ponente_id" 
            value={ponenteId}
          />
        </div>

        <div className="formulario__campo">
          <label htmlFor="disponibles" className="formulario__label">Lugares Disponibles</label>
          <input
            type="number"
            min="1"
            className="formulario__input"
            id="disponibles"
            name="disponibles"
            placeholder="Ej. 20"
            value={disponibles}
            onChange={e => setDisponibles(e.target.value)}
          />
        </div>
      </fieldset>
    </>
  );
}