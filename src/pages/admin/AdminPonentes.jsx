import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCirclePlus, FaUserPen, FaCircleXmark } from 'react-icons/fa6';
import { clienteAxios } from '../../config/axios';
import Alerta from '../../components/alertas/Alerta';
import Paginacion from '../../components/Paginacion';

export default function AdminPonentes() {
  const [ponentes, setPonentes] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const titulo = "Ponentes";

  useEffect(() => {
  const obtenerPonentes = async () => {
    try {
      const { data } = await clienteAxios.get(`/api/ponentes?page=${paginaActual}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Respuesta API ponentes:', data);
      
      // Verificar que la respuesta sea válida
      if (typeof data !== 'object') {
        console.error('Respuesta de API no es un objeto válido:', data);
        setAlerta({
          msg: 'Error en el formato de respuesta del servidor',
          tipo: 'error'
        });
        setPonentes([]);
        return;
      }
      
      // Asegurarse que ponentes sea siempre un array
      const ponentesArray = Array.isArray(data.ponentes) ? data.ponentes : 
                          (Array.isArray(data) ? data : []);
      setPonentes(ponentesArray);
      
      // Configurar paginación
      if(data.paginacion) {
        setTotalPaginas(data.paginacion.totalPaginas);
      }
      
    } catch (error) {
      console.error('Error completo:', error);
      setAlerta({
        msg: error.response?.data?.msg || 'Error al cargar los ponentes',
        tipo: 'error'
      });
      setPonentes([]);
    } finally {
      setCargando(false);
    }
  };
  
  obtenerPonentes();
}, [paginaActual]);

  const handleEliminar = async (id) => {
  if(!confirm('¿Estás seguro de eliminar este ponente?')) return;
  
  try {
    // Capturar la respuesta del servidor
    const { data } = await clienteAxios.delete(`/api/ponentes/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Ahora data está definida y puedes acceder a sus propiedades
    setAlerta({
      msg: data?.msg || 'Ponente eliminado correctamente',
      tipo: 'exito'
    });
    
    // Actualizar lista de ponentes
    setPonentes(ponentes.filter(ponente => ponente.id !== id));
    
  } catch (error) {
    console.error(error);
    setAlerta({
      msg: error.response?.data?.msg || 'Error al eliminar el ponente',
      tipo: 'error'
    });
  }
};

  const handleSubmitEliminar = async (e, id) => {
    e.preventDefault();
    await handleEliminar(id);
  };
  
  if(cargando) return <p className="text-center">Cargando...</p>;
  
  return (
    <>
      <h2 className="dashboard__heading">{titulo}</h2>
      
      <div className="dashboard__contenedor-boton">
        <Link to="/admin/ponentes/crear" className="dashboard__boton">
          <FaCirclePlus />
          &nbsp;Añadir Ponente
        </Link>
      </div>
      
      {alerta.msg && <Alerta mensaje={alerta.msg} tipo={alerta.tipo} />}
      
      <div className="dashboard__contenedor">
        {ponentes.length > 0 ? (
          <>
            <table className="table">
              <thead className="table__thead">
                <tr>
                  <th scope="col" className="table__th">Nombre</th>
                  <th scope="col" className="table__th">Ubicación</th>
                  <th scope="col" className="table__th"></th>
                </tr>
              </thead>

              <tbody className="table__tbody">
                {ponentes.map(ponente => (
                  <tr key={ponente.id} className="table__tr">
                    <td className="table__td">
                      {ponente.nombre} {ponente.apellido}
                    </td>
                    <td className="table__td">
                      {ponente.ciudad}, {ponente.pais}
                    </td>
                    <td className="table__td--acciones">
                      <Link 
                        className="table__accion table__accion--editar" 
                        to={`/admin/ponentes/editar/${ponente.id}`}
                      >
                        <FaUserPen />
                        Editar
                      </Link>

                      <form 
                        className="table__formulario"
                        onSubmit={(e) => handleSubmitEliminar(e, ponente.id)}
                      >
                        <input type="hidden" name="id" value={ponente.id} />
                        <button 
                          className="table__accion table__accion--eliminar" 
                          type="submit"
                        >
                          <FaCircleXmark />
                          Eliminar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {totalPaginas > 1 && (
              <Paginacion 
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={setPaginaActual}
              />
            )}
          </>
        ) : (
          <p className="text-center">No Hay Ponentes Aún</p>
        )}
      </div>
    </>
  );
}