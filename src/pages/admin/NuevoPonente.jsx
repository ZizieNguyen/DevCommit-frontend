import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import FormularioPonente from '../../components/admin/FormularioPonente';
import { clienteAxios } from '../../config/axios';
import Alerta from '../../components/alertas/Alerta';

export default function NuevoPonente() {
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(false);
  const titulo = "Nuevo Ponente";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    // Crear FormData del formulario directamente
    const formElement = e.target;
    const formData = new FormData(formElement);

    if(!formData.get('imagen').name) {
    console.log('No se seleccionó imagen, se usará la predeterminada');
  }
    
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
      const { data } = await clienteAxios.post('/api/ponentes', formData, { 
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  // Muestra toda la respuesta para depuración
  console.log('Respuesta del servidor:', data);
  
  if (data?.id) {
    setAlerta({
      msg: 'Ponente registrado correctamente',
      tipo: 'exito'
    });
    e.target.reset();
  } else {
    setAlerta({
      msg: 'Error al registrar el ponente',
      tipo: 'error'
    });
  
    
    // Mostrar alertas detalladas en consola
    if (data?.alertas) {
      console.log('Alertas detalladas:', data.alertas);
    }
  }

      console.log('Alerta:', alerta);

    } catch (error) {
      console.error(error);
      setAlerta({
        msg: error.response?.data?.msg || 'Hubo un error al registrar el ponente',
        tipo: 'error'
      });
    } finally {
      setCargando(false);
    }
  };
  
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
            alerta={alerta}
            setAlerta={setAlerta}
          />
          
          <input
            type="submit"
            className="formulario__submit formulario__submit--registrar"
            value={cargando ? "Procesando..." : "Registrar Ponente"}
            disabled={cargando}
          />
        </form>
      </div>
    </>
  );
}