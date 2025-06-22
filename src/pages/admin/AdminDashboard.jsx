import { useState, useEffect } from 'react';
import { clienteAxios } from '../../config/axios';
import { FaUserTag, FaUsers, FaUserTie, FaMoneyBillWave } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    registros_gratuitos: 0,
    registros_virtuales: 0,
    registros_presenciales: 0,
    ingresos: 0,
    precio_virtual: 49,
    precio_presencial: 99
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const obtenerStats = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const { data } = await clienteAxios('/admin/dashboard');
        console.log('Datos recibidos del dashboard:', data);
        
        if (data.error) {
          setError(data.msg || 'Error al cargar los datos');
          return;
        }
        
        // Obtener conteos específicos por tipo de paquete
        // El backend debería enviar estos valores, si no lo hace, los calculamos aquí
        const gratuitos = data.registros_gratuitos || data.registros_por_tipo?.gratuitos || 0;
        const virtuales = data.registros_virtuales || data.registros_por_tipo?.virtuales || 0;
        const presenciales = data.registros_presenciales || data.registros_por_tipo?.presenciales || 0;
        
        // Usar ingresos del backend o calcularlos
        const ingresos = data.ingresos || 0;
        
        setStats({
          registros_gratuitos: gratuitos,
          registros_virtuales: virtuales,
          registros_presenciales: presenciales,
          ingresos: ingresos,
          precio_virtual: 49,
          precio_presencial: 99
        });
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('No se pudo conectar con el servidor');
      } finally {
        setCargando(false);
      }
    };
    
    obtenerStats();
  }, []);

  if (cargando) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;
  
  return (
    <>
      <h2 className="dashboard__heading">Panel de Administración</h2>
      
      <main className="bloques">
        <div className="bloques__grid">
          <div className="bloque">
            <h3 className="bloque__heading">
              <FaUserTag className="mr-2" /> Registros Gratuitos
            </h3>
            <p className="bloque__texto--cantidad">{stats.registros_gratuitos}</p>
            <p className="bloque__texto text-center">Pase: €0</p>
          </div>
          
          <div className="bloque">
            <h3 className="bloque__heading">
              <FaUsers className="mr-2" /> Registros Virtuales
            </h3>
            <p className="bloque__texto--cantidad">{stats.registros_virtuales}</p>
            <p className="bloque__texto text-center">Pase: €{stats.precio_virtual}</p>
          </div>
          
          <div className="bloque">
            <h3 className="bloque__heading">
              <FaUserTie className="mr-2" /> Registros Presenciales
            </h3>
            <p className="bloque__texto--cantidad">{stats.registros_presenciales}</p>
            <p className="bloque__texto text-center">Pase: €{stats.precio_presencial}</p>
          </div>
          
          <div className="bloque">
            <h3 className="bloque__heading">
              <FaMoneyBillWave className="mr-2" /> Ingresos Totales
            </h3>
            <p className="bloque__texto--cantidad">€{stats.ingresos}</p>
            <p className="bloque__texto text-center">
              (€{stats.precio_virtual} × {stats.registros_virtuales} + 
              €{stats.precio_presencial} × {stats.registros_presenciales})
            </p>
          </div>
        </div>
      </main>
    </>
  );
}