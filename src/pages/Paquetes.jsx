import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { clienteAxios } from '../config/axios';
import Alerta from '../components/alertas/Alerta';
import PagoModal from '../components/PagoModal';
import '../styles/inicio.css';
import '../styles/paquetes.css';

export default function Paquetes() {
  const [alerta, setAlerta] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [procesoActivo, setProcesoActivo] = useState(null); // Nuevo: para rastrear qué botón está procesando
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(null);
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verificarRegistro = async () => {
      if (!auth?.id) return;
      
      try {
        const { data } = await clienteAxios('/api/registro/verificar');
        if (data.registrado) {
          setUsuarioRegistrado(true);
          setAlerta({
            tipo: 'info',
            msg: 'Ya tienes un paquete registrado. Explora los eventos disponibles.'
          });
        }
      } catch (error) {
        console.error('Error al verificar registro:', error);
      }
    };
    
    verificarRegistro();
  }, [auth]);

  const handleRegistroGratis = async () => {
  if (!auth?.id) {
    navigate('/login', { 
      state: { mensaje: 'Necesitas iniciar sesión para registrarte', redirigirA: '/paquetes' } 
    });
    return;
  }
  
  setProcesoActivo('gratis');
  
  try {
    // Convertir explícitamente a string para asegurar formato correcto
    const userId = String(auth.id).trim();
    console.log('Enviando ID en el cuerpo de la petición:', userId);
    
    // Imprimir la URL base que está usando axios
    console.log('URL base de axios:', import.meta.env.VITE_API_URL || 'http://localhost:3000');
    
    // Usar axios directamente sin el cliente configurado
    const { data } = await clienteAxios.post('/api/registro/gratis', {
    usuario_id: userId
  });
    console.log('Respuesta del servidor:', data);
    
    if (data.error) {
      setAlerta({ msg: data.msg, tipo: 'error' });
    } else {
      setAlerta({ msg: 'Te has registrado correctamente al plan gratuito', tipo: 'exito' });
      setUsuarioRegistrado(true);
    }
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Detalles de la respuesta:', error.response?.data);
    setAlerta({ 
      msg: error.response?.data?.msg || 'Error al conectar con el servidor', 
      tipo: 'error' 
    });
  } finally {
    setProcesoActivo(null);
  }
};
  
  const abrirModalPago = (tipo, id, precio) => {
    if (!auth?.id) {
      navigate('/login', { 
        state: { 
          mensaje: 'Necesitas iniciar sesión para registrarte', 
          redirigirA: '/paquetes' 
        } 
      });
      return;
    }
    
    setPaqueteSeleccionado({
      tipo,
      id,
      precio
    });
    
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
    setPaqueteSeleccionado(null);
  };
  
  const procesarPagoExitoso = async (datos) => {
  // Marcar solo este proceso como activo
  setProcesoActivo(paqueteSeleccionado.tipo.toLowerCase());
  
  try {
    // Agregar el ID del usuario actual, igual que en handleRegistroGratis
    const userId = String(auth.id).trim();
    
    console.log("Enviando datos:", {
      usuario_id: userId,
      paquete_id: paqueteSeleccionado.id,
      pago_id: `sim_${Date.now()}`,
      regalo_id: datos?.regalo_id || null
    });
    
    const { data } = await clienteAxios.post('/api/registro/simular-pago', {
      usuario_id: userId,  // AÑADIR ESTA LÍNEA
      paquete_id: paqueteSeleccionado.id,
      pago_id: `sim_${Date.now()}`,
      regalo_id: datos?.regalo_id || null
    });
    
    if (data.error) {
      setAlerta({
        msg: data.msg || 'Error al procesar el pago',
        tipo: 'error'
      });
      setProcesoActivo(null);
      cerrarModal();
      return;
    }
    
    cerrarModal();
    
    setAlerta({
      msg: '¡Pago procesado con éxito! Se ha enviado un correo con tu confirmación.',
      tipo: 'exito'
    });
    
    // Actualizar estado de usuario registrado, igual que en el plan gratuito
    setUsuarioRegistrado(true);
    
    // Eliminar el setTimeout que redirigía automáticamente
    
  } catch (error) {
    console.error('Error en el procesamiento del pago:', error);
    setAlerta({
      msg: error.response?.data?.msg || 'Error al procesar el pago',
      tipo: 'error'
    });
    setProcesoActivo(null);
    cerrarModal();
  }
};

  return (
    <main className="paquetes">
    <h2 className="paquetes__heading">Paquetes DevCommit</h2>
    <p className="paquetes__descripcion">Compara los paquetes de DevCommit</p>

    {/* Alerta con botón condicional cuando el registro es exitoso */}
    {alerta.msg && (
      <div className={`alerta-container ${alerta.tipo === 'exito' ? 'alerta-exito' : ''}`}>
    <Alerta tipo={alerta.tipo} mensaje={alerta.msg} />
    
  </div>
    )}

      {usuarioRegistrado ? (
        <div className="paquetes__registrado">
          <p>Ya tienes un paquete registrado.</p>
          <Link to="/eventos" className="paquetes__boton">
            Ver eventos disponibles
          </Link>
        </div>
      ) : (
        <div className="boletos__grid">
          {/* Pase Gratis */}
          <div className="boleto boleto--gratis">
            <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
            <p className="boleto__plan">Gratis</p>
            <ul className="paquete__lista">
              <li className="paquete__elemento">Conferencias: Algunas conferencias virtuales básicas</li>
              <li className="paquete__elemento paquete__elemento--no">Acceso a talleres</li>
              <li className="paquete__elemento paquete__elemento--no">Contenido exclusivo</li>
              <li className="paquete__elemento paquete__elemento--no">Certificados</li>
              <li className="paquete__elemento paquete__elemento--no">Networking</li>
              <li className="paquete__elemento paquete__elemento--no">Materiales descargables</li>
              <li className="paquete__elemento paquete__elemento--no">Grabaciones</li>
            </ul>
            <p className="boleto__precio">$0</p>
            <div className="boleto__enlace-contenedor">
              <button 
                className="boleto__enlace"
                onClick={handleRegistroGratis}
                disabled={procesoActivo !== null}
              >
                {procesoActivo === 'gratis' ? 'Procesando...' : 'Inscripción Gratis'}
              </button>
            </div>
          </div>

          {/* Pase Presencial */}
          <div className="boleto boleto--presencial">
            <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
            <p className="boleto__plan">Presencial</p>
            <ul className="paquete__lista">
              <li className="paquete__elemento">Conferencias: Todas (presencial + virtual)</li>
              <li className="paquete__elemento">Acceso prioritario a talleres</li>
              <li className="paquete__elemento">Kit de bienvenida con merchandising</li>
              <li className="paquete__elemento">Comidas y coffee breaks incluidos</li>
              <li className="paquete__elemento">Certificado físico y digital</li>
              <li className="paquete__elemento">Eventos sociales y networking</li>
              <li className="paquete__elemento">Materiales físicos y digitales</li>
              <li className="paquete__elemento">Grabaciones permanentes</li>
            </ul>
            <p className="boleto__precio">$99</p>
            <div className="boleto__enlace-contenedor">
              <button 
                className="boleto__enlace"
                onClick={() => abrirModalPago('Presencial', 1, '$99')}
                disabled={procesoActivo !== null}
              >
                {procesoActivo === 'presencial' ? 'Procesando...' : 'Comprar Pase'}
              </button>
            </div>
          </div>

          {/* Pase Virtual */}
          <div className="boleto boleto--virtual">
            <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
            <p className="boleto__plan">Virtual</p>
            <ul className="paquete__lista">
              <li className="paquete__elemento">Conferencias: Acceso completo virtual</li>
              <li className="paquete__elemento">Talleres virtuales interactivos</li>
              <li className="paquete__elemento">Contenido exclusivo descargable</li>
              <li className="paquete__elemento">Certificado digital</li>
              <li className="paquete__elemento">Salas virtuales de networking</li>
              <li className="paquete__elemento">Materiales complementarios</li>
              <li className="paquete__elemento">Grabaciones (30 días)</li>
            </ul>
            <p className="boleto__precio">$49</p>
            <div className="boleto__enlace-contenedor">
              <button 
                className="boleto__enlace"
                onClick={() => abrirModalPago('Virtual', 2, '$49')}
                disabled={procesoActivo !== null}
              >
                {procesoActivo === 'virtual' ? 'Procesando...' : 'Comprar Pase'}
              </button>
            </div>
          </div>

          
        </div>
      )}
      
      {/* Modal de pago */}
      {modalAbierto && paqueteSeleccionado && (
        <PagoModal 
          isOpen={modalAbierto}
          onClose={cerrarModal}
          onSuccess={procesarPagoExitoso}
          paquete={paqueteSeleccionado.tipo}
          precio={paqueteSeleccionado.precio}
          paqueteId={paqueteSeleccionado.id}
        />
      )}
    </main>
  );
}