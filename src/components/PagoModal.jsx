import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { clienteAxios } from '../config/axios';
import '../styles/pagoModal.css';

export default function PagoModal({ isOpen, onClose, onSuccess, paquete, precio, paqueteId }) {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    numero: '4242 4242 4242 4242',
    nombre: '',
    expiracion: '12/25',
    cvv: '123'
  });
  const [regalos, setRegalos] = useState([]);
  const [regaloId, setRegaloId] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);

  // Al montar el componente, prellenar el nombre con el del usuario y cargar regalos
  useEffect(() => {
  if (auth?.nombre) {
    setFormData(prev => ({
      ...prev,
      nombre: `${auth.nombre} ${auth.apellido || ''}`
    }));
  }

    // Cargar los regalos disponibles si es paquete presencial
    const cargarRegalos = async () => {
      // Solo cargar regalos para paquete presencial (ID 1)
      if (parseInt(paqueteId) === 1) {
        try {
  console.log('Solicitando regalos al API...');
  const response = await clienteAxios.get(`/api/regalos?t=${new Date().getTime()}`);
  let data = response.data;
  
  // Si la respuesta es un string (posiblemente con advertencias), intentar extraer el JSON
  if (typeof data === 'string') {
    try {
      // Buscar la parte que parece JSON (comienza con '[' y termina con ']')
      const jsonMatch = data.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
        console.log('JSON extraído de respuesta con advertencias');
      }
    } catch (parseError) {
      console.error('Error al extraer JSON:', parseError);
    }
  }
  
  console.log('Datos procesados:', data);
  
  if (Array.isArray(data) && data.length > 0) {
    setRegalos(data);
    console.log('Regalos cargados correctamente:', data.length);
  } else {
    console.warn('La API devolvió un formato inesperado o vacío:', data);
    setErrores(prev => ({ ...prev, regalo: 'No se pudieron cargar las opciones de regalos' }));
  }
} catch (error) {
  console.error('Error al cargar regalos:', error);
  setErrores(prev => ({ ...prev, regalo: 'Error al cargar opciones de regalos' }));
} finally {
  setCargando(false);
}
      } else {
        setCargando(false);
      }
    };

    cargarRegalos();
  }, [auth, paqueteId]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 27 && isOpen && !procesando) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, procesando]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name } = e.target; // Eliminamos 'value' ya que no la utilizamos
    
    // Mostrar mensaje de advertencia
    setErrores({
      ...errores,
      [name]: "Este campo no es editable. Es una simulación de pago."
    });
    // No actualizar el estado - mantener los valores predefinidos
  };

  const handleRegaloChange = (e) => {
    setRegaloId(e.target.value);
    
    // Eliminar error si existiera
    if (errores.regalo) {
      const nuevosErrores = {...errores};
      delete nuevosErrores.regalo;
      setErrores(nuevosErrores);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }
    
    // Para pase presencial, validar que se haya seleccionado un regalo
    if (paqueteId === 1 && !regaloId) {
      nuevosErrores.regalo = 'Debes seleccionar un regalo (obligatorio para el paquete presencial)';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setProcesando(true);
    
    try {
      // Simular un tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Llamar a onSuccess para que el componente padre maneje el resultado exitoso
      onSuccess({
        regalo_id: regaloId || null
      });
    } catch (error) {
      console.error('Error en el procesamiento del pago:', error);
      setErrores({ submit: 'Ocurrió un error al procesar el pago' });
      setProcesando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Procesar pago - {paquete}</h2>
          {!procesando && (
            <button 
              type="button" 
              className="modal-close" 
              onClick={onClose}
              aria-label="Cerrar"
            >
              &times;
            </button>
          )}
        </div>
        
        <div className="modal-body">
          <div className="modal-aviso">
            <p className="modal-aviso__texto">
              <strong>¡Simulación de pago!</strong> Esto es una demostración, no se realizará ningún cargo real.
              Los campos están pre-llenados y no son editables.
            </p>
          </div>
          
          <div className="pago-resumen">
            <h3>Resumen de compra</h3>
            <div className="pago-detalle">
              <span>Paquete {paquete}</span>
              <span className="pago-precio">{precio}</span>
            </div>
            <div className="pago-detalle">
              <span>Usuario</span>
              <span>{auth?.nombre} {auth?.apellido || ''}</span>
            </div>
            <div className="pago-detalle">
              <span>Email</span>
              <span>{auth?.email}</span>
            </div>
            <div className="pago-detalle pago-total">
              <span>Total a pagar</span>
              <span className="pago-precio">{precio}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pago-form">
            <div className="form-group">
              <label htmlFor="numero">Número de tarjeta</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                disabled={procesando}
                placeholder="4242 4242 4242 4242"
                className="input-readonly"
              />
              {errores.numero && <span className="error-text">{errores.numero}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre en la tarjeta</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={procesando}
                placeholder={`${auth?.nombre || ''} ${auth?.apellido || ''}`}
                className={`input-readonly ${errores.nombre ? 'error' : ''}`}
              />
              {errores.nombre && <span className="error-text">{errores.nombre}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiracion">Fecha de expiración</label>
                <input
                  type="text"
                  id="expiracion"
                  name="expiracion"
                  value={formData.expiracion}
                  onChange={handleChange}
                  disabled={procesando}
                  placeholder="MM/AA"
                  className="input-readonly"
                />
                {errores.expiracion && <span className="error-text">{errores.expiracion}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  disabled={procesando}
                  placeholder="123"
                  className="input-readonly"
                />
                {errores.cvv && <span className="error-text">{errores.cvv}</span>}
              </div>
            </div>

            {/* Sección de selección de regalo solo para pase presencial */}
            {paqueteId === 1 && (
              <div className="form-group regalo-seleccion">
                <label htmlFor="regalo">Selecciona tu regalo <span className="campo-obligatorio">*</span></label>
                <select
                  id="regalo"
                  name="regalo"
                  value={regaloId}
                  onChange={handleRegaloChange}
                  disabled={procesando || cargando}
                  className={errores.regalo ? 'error' : ''}
                  required
                >
                  <option value="">-- Selecciona un regalo --</option>
                  {regalos.map(regalo => (
                    <option key={regalo.id} value={regalo.id}>
                      {regalo.nombre}
                    </option>
                  ))}
                </select>
                {errores.regalo && <span className="error-text">{errores.regalo}</span>}
                {cargando && <span className="info-text">Cargando opciones...</span>}
              </div>
            )}

            {errores.submit && <div className="error-text">{errores.submit}</div>}

            <button 
              type="submit" 
              className="btn-pagar"
              disabled={procesando}
            >
              {procesando ? (
                <><span className="loader"></span> Procesando...</>
              ) : (
                `Pagar ${precio}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}