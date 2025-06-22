import { useState } from 'react';
import { Link } from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Campo from '../components/formulario/Campo';
import Submit from '../components/formulario/Submit';
import Alerta from '../components/alertas/Alerta';

export default function OlvidePassword() {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validar email
    if(email === '' || email.trim() === '') {
      setAlerta({
        msg: 'El Email es Obligatorio',
        tipo: 'error'
      });
      return;
    }

    // Comprobar formato de email con regex
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if(!emailRegex.test(email)) {
      setAlerta({
        msg: 'El Email no es válido',
        tipo: 'error'
      });
      return;
    }

    // Limpiar alerta previa
    setAlerta({});

    // Envío a la API
    try {
      console.log("Enviando solicitud...");
      const { data } = await clienteAxios.post('/olvide-password', { email });
      console.log("Respuesta recibida:", data);
      
      setAlerta({
        msg: data.msg || "Hemos enviado las instrucciones a tu email", // Mensaje por defecto
        tipo: data.error ? 'error' : 'exito'
      });
      
      // Importante: Vaciar el campo email si fue exitoso
      if (!data.error) {
        setEmail('');
      }
    } catch (error) {
      console.error("Error:", error);
      setAlerta({
        msg: error.response?.data?.msg || 'Hubo un error, intente nuevamente',
        tipo: 'error'
      });
    }
  };

  const { msg, tipo } = alerta;

  return (
    <div className="auth">
      <div className="auth__contenedor">
        <h1 className="auth__heading">Recuperar Acceso</h1>
        <p className="auth__texto">
          Recupera tu acceso a DevCommit ingresando tu email
        </p>

        {msg && <Alerta tipo={tipo} mensaje={msg} />}
        
        <form 
          className="formulario"
          onSubmit={handleSubmit}
        >
          <Campo 
            label="Email"
            id="email"
            type="email"
            placeholder="Tu Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <Submit value="Enviar Instrucciones" />
        </form>

        <div className="acciones">
          <Link 
            to="/login"
            className="acciones__enlace"
          >
            ¿Ya tienes cuenta? Iniciar sesión
          </Link>
          
          <Link 
            to="/registro"
            className="acciones__enlace"
          >
            ¿Aún no tienes cuenta? Obtener una
          </Link>
        </div>
      </div>
    </div>
  );
}