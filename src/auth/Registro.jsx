import { useState } from 'react';
import { Link} from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Campo from '../components/formulario/Campo';
import Submit from '../components/formulario/Submit';
import Alerta from '../components/alertas/Alerta';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});



  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validaciones
    if([nombre, apellido, email, password, repetirPassword].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        tipo: 'error'
      });
      return;
    }

    if(password !== repetirPassword) {
      setAlerta({
        msg: 'Los passwords no coinciden',
        tipo: 'error'
      });
      return;
    }

    if(password.length < 6) {
      setAlerta({
        msg: 'El password debe contener al menos 6 caracteres',
        tipo: 'error'
      });
      return;
    }

    // Limpiar la alerta
    setAlerta({});
    const datos = {
      nombre,
      apellido,
      email,
      password,
      password2: repetirPassword
    };

    console.log('Datos a enviar:', datos);

    // Enviar petición a la API
    try {
      // Lógica para registrar al usuario
      console.log('Enviando registro...');

      const { data } = await clienteAxios.post('/registro', datos);
      console.log('Respuesta del servidor:', data);
      
      // Verificar si hay error en la respuesta
      if (data.error) {
        setAlerta({
          msg: data.msg,
          tipo: 'error'
        });
        return;
      }
      
      // Mostrar alerta de éxito solo si no hay error
      setAlerta({
        msg: data.msg || 'Cuenta creada correctamente. Revisa tu email para confirmar tu cuenta',
        tipo: 'exito'
      });
      
      // Resetear formulario
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
      
    } catch (error) {
      setAlerta({
        msg: error.response?.data?.msg || 'Error al crear la cuenta',
        tipo: 'error'
      });
    }
  };

  const { msg, tipo } = alerta;

  

  return (
    <div className="auth">
      <div className="auth__contenedor">
        <h1 className="auth__heading">Crear Cuenta</h1>
        <p className="auth__texto">
          Crea tu cuenta en DevCommit
        </p>

        {msg && <Alerta tipo={tipo} mensaje={msg} />}
        
        <form 
          className="formulario"
          onSubmit={handleSubmit}
        >
          <Campo 
            label="Nombre"
            id="nombre"
            type="text"
            placeholder="Tu Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          
          <Campo 
            label="Apellido"
            id="apellido"
            type="text"
            placeholder="Tu Apellido"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
          />

          <Campo 
            label="Email"
            id="email"
            type="email"
            placeholder="Tu Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          
          <Campo 
            label="Password"
            id="password"
            type="password"
            placeholder="Tu Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          
          <Campo 
            label="Repetir Password"
            id="password2"
            type="password"
            placeholder="Repite tu Password"
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
          />

          <Submit value="Crear Cuenta" />
        </form>

        <div className="acciones">
          <Link 
            to="/login"
            className="acciones__enlace"
          >
            ¿Ya tienes cuenta? Iniciar sesión
          </Link>
          
          <Link 
            to="/olvide-password"
            className="acciones__enlace"
          >
            ¿Olvidaste tu password?
          </Link>
        </div>
      </div>
    </div>
  );
}