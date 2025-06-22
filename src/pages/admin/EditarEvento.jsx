import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alerta from '../../components/alertas/Alerta';
import FormularioEvento from '../../components/admin/FormularioEvento';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { clienteAxios } from '../../config/axios';
import Submit from '../../components/formulario/Submit';

export default function EditarEvento() {
  const [evento, setEvento] = useState({});
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(true);
  const { id } = useParams();
  const titulo = "Editar Evento";
  
  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        // Corregir la URL para que coincida con la ruta definida en index.php
        const { data } = await clienteAxios(`/admin/eventos/editar/${id}`);
        console.log("Datos del evento recibidos:", data);
        
        if (data.evento) {
          setEvento(data.evento);
        } else {
          setAlerta({
            msg: 'No se encontró el evento',
            tipo: 'error'
          });
        }
      } catch (error) {
        console.error('Error al obtener el evento:', error);
        setAlerta({
          msg: error.response?.data?.msg || 'Error al cargar el evento',
          tipo: 'error'
        });
      } finally {
        setCargando(false);
      }
    };
    
    obtenerEvento();
  }, [id]);
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Obtener los datos del formulario y convertirlos a objeto
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData);
    
    console.log("Datos a enviar:", datos);
    
    // Enviar los datos correctamente como JSON
    const { data } = await clienteAxios.post(`/admin/eventos/editar/${id}`, JSON.stringify(datos), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Respuesta del servidor:", data);
    
    // Mostrar mensaje de éxito
    setAlerta({
      msg: data.msg || 'Cambios guardados correctamente',
      tipo: 'exito'
    });
    
    // No hay redirección automática como solicitaste
  } catch (error) {
    console.error('Error completo al actualizar:', error);
    console.error('Respuesta del servidor:', error.response?.data);
    
    // Mejorar el mensaje de error
    let mensajeError = 'Error al guardar los cambios';
    if (error.response?.data?.msg) {
      if (typeof error.response.data.msg === 'string') {
        mensajeError = error.response.data.msg;
      } else if (typeof error.response.data.msg === 'object') {
        // Si es un objeto de errores, unir los mensajes
        const errores = Object.values(error.response.data.msg).flat();
        mensajeError = errores.join(', ');
      }
    }
    
    setAlerta({
      msg: mensajeError,
      tipo: 'error'
    });
  }
};
  
  const { msg, tipo } = alerta;
  
  if (cargando) return <p className="text-center">Cargando...</p>;
  
  return (
    <>
      <h2 className="dashboard__heading">{titulo}</h2>
      
      <div className="dashboard__contenedor-boton">
        <Link to="/admin/eventos" className="dashboard__boton">
          <FaCircleArrowLeft />
          Volver
        </Link>
      </div>
      
      <div className="dashboard__formulario">
        {msg && <Alerta tipo={tipo} mensaje={msg} />}
        
        {!cargando && Object.keys(evento).length > 0 && (
          <form 
            className="formulario"
            onSubmit={handleSubmit}
          >
            {/* Pasar el ID para asegurarnos de que se actualice y no se cree uno nuevo */}
            <input type="hidden" name="id" value={evento.id} />
            
            <FormularioEvento 
              evento={evento}
            />
            
            <Submit 
              value="Guardar Cambios" 
              className="formulario__submit--registrar" 
            />
          </form>
        )}
        
        {!cargando && Object.keys(evento).length === 0 && !msg && (
          <p className="text-center">No se encontró el evento</p>
        )}
      </div>
    </>
  );
}