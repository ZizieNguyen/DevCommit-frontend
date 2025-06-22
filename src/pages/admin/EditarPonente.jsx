import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import FormularioPonente from '../../components/admin/FormularioPonente';
import { clienteAxios } from '../../config/axios';
import Alerta from '../../components/alertas/Alerta';

export default function EditarPonente() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ponente, setPonente] = useState({});
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(false);
  const [actualizadoExitoso, setActualizadoExitoso] = useState(false);
  const titulo = "Editar Ponente";

  useEffect(() => {
    const obtenerPonente = async () => {
      setCargando(true);
      try {
        const { data } = await clienteAxios.get(`/api/ponente/${id}`);
        
        if(data && !data.error) {
          setPonente(data);
        } else {
          setAlerta({
            msg: 'No se encontró el ponente',
            tipo: 'error'
          });
        }
      } catch (error) {
        console.error(error);
        setAlerta({
          msg: error.response?.data?.msg || 'Error al cargar los datos del ponente',
          tipo: 'error'
        });
      } finally {
        setCargando(false);
      }
    };

    obtenerPonente();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (actualizadoExitoso) {
      // Si ya se actualizó, el botón ahora navega a la lista
      navigate('/admin/ponentes');
      return;
    }
    
    setCargando(true);
    
    // Crear FormData del formulario directamente
    const formElement = e.target;
    const formData = new FormData(formElement);
    
    // Añadir el ID del ponente
    formData.append('id', id);
    
    if(!formData.get('imagen').name) {
      console.log('No se seleccionó imagen, se mantendrá la actual');
    }
    
    // Procesar redes sociales
    const redes = {};
    for (let [key, value] of formData.entries()) {
      if (key.includes('redes[')) {
        const redSocial = key.split('[')[1].split(']')[0];
        redes[redSocial] = value;
        formData.delete(key);
      }
    }
    
    // Añadir redes como JSON
    formData.append('redes', JSON.stringify(redes));
    
    try {
      const { data } = await clienteAxios.post('/api/ponentes/editar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(!data.error) {
        setAlerta({
          msg: 'Ponente actualizado correctamente',
          tipo: 'exito'
        });
        
        // Marcar como actualizado exitosamente
        setActualizadoExitoso(true);
      } else {
        setAlerta({
          msg: data.msg || 'Error al actualizar el ponente',
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      setAlerta({
        msg: error.response?.data?.msg || 'Error al actualizar el ponente',
        tipo: 'error'
      });
    } finally {
      setCargando(false);
    }
  };

  // Determinar el texto y la clase del botón
  const botonTexto = actualizadoExitoso 
    ? "Ver Lista de Ponentes" 
    : cargando ? "Procesando..." : "Guardar Cambios";
  
  const botonClase = `formulario__submit formulario__submit--registrar ${
    actualizadoExitoso ? 'formulario__submit--exito' : ''
  }`;

  return (
    <>
      <h2 className="dashboard__heading">{titulo}</h2>

      <div className="dashboard__contenedor-boton">
        <Link to="/admin/ponentes" className="dashboard__boton">
          <FaCircleArrowLeft /> 
          &nbsp;Volver
        </Link>
      </div>

      <div className="dashboard__formulario">
        {alerta.msg && <Alerta mensaje={alerta.msg} tipo={alerta.tipo} />}

        <form 
          className="formulario"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <FormularioPonente 
            ponente={ponente}
            alerta={alerta}
            setAlerta={setAlerta}
          />
          
          <input
            type="submit"
            className={botonClase}
            value={botonTexto}
            disabled={cargando}
          />
        </form>
      </div>
    </>
  );
}