import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import '../styles/admin.css';

export default function AdminLayout() {
  const { auth, cargando } = useAuth();
  
  if(cargando) return 'Cargando...';
  
  // Redireccionar si el usuario no está autenticado o no es admin
 if(!auth || typeof auth !== 'object' || (auth.admin !== 1 && auth.admin !== true && auth.admin !== "1")) {
  console.log("Redirigiendo porque:", { auth });
  return <Navigate to="/login" state={{ mensaje: "Necesitas loguearte como administrador para acceder" }} />;
}
  
  return (
    <div className="dashboard">
      <AdminHeader />
      
      <div className="dashboard__grid">
        <AdminSidebar />
        
        <main className="dashboard__contenido">
          <Outlet />
        </main>
      </div>
    </div>
  );
}