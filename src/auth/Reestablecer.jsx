import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Alerta from '../components/alertas/Alerta';
import Campo from '../components/formulario/Campo';
import Submit from '../components/formulario/Submit';

export default function Reestablecer() {
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});
  const [tokenValido, setTokenValido] = useState(false);
  const [passwordModificado, setPasswordModificado] = useState(false);
  
  const params = useParams();
  const token = params.token || '';
  
  useEffect(() => {
    const comprobarToken = async () => {
      if(!token) {
        setAlerta({
          msg: 'No hay token en la URL',
          tipo: 'error'
        });
        return;
      }
      
      try {
        await clienteAxios(`/olvide-password/${token}`);
        setTokenValido(true);
      } catch {
        setAlerta({
          msg: 'Hubo un error con el enlace',
          tipo: 'error'
        });
      }
    };
    
    comprobarToken();
  }, [token]);
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    if(password.trim() === '' || password.length < 6) {
      setAlerta({
        msg: 'El Password debe contener al menos 6 caracteres',
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
    
    try {
      const { data } = await clienteAxios.post(`/olvide-password/${token}`, {
        password
      });
      
      setAlerta({
        msg: data.msg,
        tipo: 'exito'
      });
      
      setPasswordModificado(true);
      
      // Limpiar los campos
      setPassword('');
      setRepetirPassword('');
      
    } catch (errorSubmit) { // Renombrado para evitar redefinición
      setAlerta({
        msg: errorSubmit.response?.data?.msg || "Ha ocurrido un error",
        tipo: 'error'
      });
    }
  };
  
  const { msg, tipo } = alerta;
  
  return (
    <div className="auth">
      <div className="auth__contenedor">
        <h1 className="auth__heading">Reestablecer Password</h1>
        <p className="auth__texto">Coloca tu nuevo password a continuación</p>

        {msg && <Alerta tipo={tipo} mensaje={msg} />}
        
        {tokenValido && !passwordModificado && (
          <form 
            className="formulario"
            onSubmit={handleSubmit}
          >
            <Campo 
              label="Nuevo Password"
              id="password"
              type="password"
              placeholder="Tu Nuevo Password"
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
            
            <Submit value="Guardar Nuevo Password" />
          </form>
        )}
        
        {passwordModificado && (
          <div className="acciones">
            <Link 
              to="/login"
              className="acciones__enlace"
            >
              ¿Ya tienes una cuenta? Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}