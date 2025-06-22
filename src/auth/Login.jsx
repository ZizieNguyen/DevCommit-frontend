import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clienteAxios } from '../config/axios';
import Campo from '../components/formulario/Campo';
import Submit from '../components/formulario/Submit';
import Alerta from '../components/alertas/Alerta';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const location = useLocation();
  useEffect(() => {
  if (location.state?.mensaje) {
    setAlerta({
      msg: location.state.mensaje,
      tipo: 'error'
    });
    // Opcional: limpiar el state para que no persista al recargar
    window.history.replaceState({}, document.title);
  }
}, [location]);

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validación básica
    if([email, password].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        tipo: 'error'
      });
      return;
    }
    
    try {
      const { data } = await clienteAxios.post('/login', { email, password });
      
      if(data.error) {
        setAlerta({
          msg: data.msg,
          tipo: 'error'
        });
        return;
      }
      
      // Login exitoso
      localStorage.setItem('token', data.token);
      
      setAuth(data.usuario || data);

      const userObj = data.usuario || data;
      localStorage.setItem('auth_data', JSON.stringify(userObj));
      setAuth(userObj);
      console.log("Datos de usuario:", JSON.stringify(data, null, 2));
      console.log("Campo admin:", userObj.admin, "Tipo:", typeof userObj.admin);
      const isAdmin = userObj.admin === 1 || userObj.admin === true || userObj.admin === "1";
      console.log("¿Es admin?", isAdmin);

      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      setAlerta({
        msg: error.response?.data?.msg || 'Error al iniciar sesión',
        tipo: 'error'
      });
    }
  };

  const { msg, tipo } = alerta;

  return (
    <div className="auth">
      <div className="auth__contenedor">
        <h1 className="auth__heading">Iniciar Sesión</h1>
        <p className="auth__texto">Inicia sesión en DevCommit</p>
        
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
          
          <Campo 
            label="Password"
            id="password"
            type="password"
            placeholder="Tu Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Submit value="Iniciar Sesión" />
        </form>

        <div className="acciones">
          <Link 
            to="/olvide-password"
            className="acciones__enlace"
          >
            ¿Olvidaste tu password?
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