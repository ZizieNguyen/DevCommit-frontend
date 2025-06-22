import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Alerta from '../components/alertas/Alerta';
import {clienteAxios} from '../config/axios';

export default function Confirmar() {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const [cargando, setCargando] = useState(true);
  
  const params = useParams();
  const { token } = params;
  
  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/confirmar/${token}`;
        const { data } = await clienteAxios.get(url);
        
        setAlerta({
          tipo: 'exito',
          mensaje: data.msg
        });
        
        setCuentaConfirmada(true);
      } catch (error) {
        setAlerta({
          tipo: 'error',
          mensaje: error.response?.data?.msg || 'El token de confirmación no es válido'
        });
      } finally {
        setCargando(false);
      }
    };
    
    confirmarCuenta();
  }, [token]);

  return (
    <>
      <div className="contenedor confirmar">
        <h1 className="titulo">Confirma tu cuenta</h1>
        <p className="descripcion">Revisa tu cuenta y comienza a disfrutar del evento</p>
        
        {cargando ? (
          <p className="texto-center">Cargando...</p>
        ) : (
          <>
            {alerta.mensaje && <Alerta tipo={alerta.tipo} mensaje={alerta.mensaje} />}
            
            {cuentaConfirmada && (
              <div className="acciones">
                <Link to="/login" className="boton boton--primario">Iniciar Sesión</Link>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}