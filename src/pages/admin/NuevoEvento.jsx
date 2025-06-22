import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../../components/alertas/Alerta';
import FormularioEvento from '../../components/admin/FormularioEvento';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { clienteAxios } from '../../config/axios';
import Submit from '../../components/formulario/Submit';

export default function NuevoEvento() {
  const [alerta, setAlerta] = useState({});
  
  const titulo = "Crear Evento";
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Obtener los datos del formulario en formato JSON
  const formData = new FormData(e.target);
  const datos = Object.fromEntries(formData);
  
  try {
    console.log('Datos a enviar:', datos);

    // Enviar como JSON
    const response = await clienteAxios.post('/admin/eventos/crear', JSON.stringify(datos), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta completa:', response);

    const { data } = response;
    
    setAlerta({
      msg: data.msg || 'Evento creado correctamente',
      tipo: 'exito'
    });

  } catch (error) {
    console.error('Error al crear evento:', error);
    console.log('Respuesta del servidor:', error.response?.data);

    let mensaje = 'Error al crear el evento';
      if (error.response?.data?.msg) {
        if (typeof error.response.data.msg === 'string') {
          mensaje = error.response.data.msg;
        } else if (error.response.data.msg.error) {
          // Si es un array de errores de validación
          mensaje = Object.values(error.response.data.msg.error).join(', ');
        }
      }  
    
    setAlerta({
      msg: mensaje,
      tipo: 'error'
    });
  }
};
  
  const { msg, tipo } = alerta;
  
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
        
        <form 
          className="formulario"
          onSubmit={handleSubmit}
        >
          <FormularioEvento />
          
          <Submit 
            value="Registrar Evento" 
            className="formulario__submit--registrar" 
            />
        </form>
      </div>
    </>
  );
}