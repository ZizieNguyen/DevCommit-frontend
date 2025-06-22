import { Link, NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaMicrophone, 
  FaGift,
  FaUserEdit
} from 'react-icons/fa';

export default function AdminSidebar() {
  return (
    <aside className="dashboard__sidebar">
      <nav className="dashboard__menu">
        <NavLink 
          to="/admin/dashboard" 
          className={({isActive}) => isActive ? "dashboard__enlace dashboard__enlace--actual" : "dashboard__enlace"}
          end
        >
          <FaHome className="dashboard__icono" />
          <span className="dashboard__menu-texto">
            Inicio
          </span>
        </NavLink>
        
        <NavLink 
          to="/admin/ponentes" 
          className={({isActive}) => isActive ? "dashboard__enlace dashboard__enlace--actual" : "dashboard__enlace"}
        >
          <FaMicrophone className="dashboard__icono" />
          <span className="dashboard__menu-texto">
            Ponentes
          </span>
        </NavLink>
        
        <NavLink 
          to="/admin/eventos" 
          className={({isActive}) => isActive ? "dashboard__enlace dashboard__enlace--actual" : "dashboard__enlace"}
        >
          <FaCalendarAlt className="dashboard__icono" />
          <span className="dashboard__menu-texto">
            Eventos
          </span>
        </NavLink>
        
        {/* <NavLink 
          to="/admin/registrados" 
          className={({isActive}) => isActive ? "dashboard__enlace dashboard__enlace--actual" : "dashboard__enlace"}
        >
          <FaUsers className="dashboard__icono" />
          <span className="dashboard__menu-texto">
            Registrados
          </span>
        </NavLink>
        
        <NavLink 
          to="/admin/regalos" 
          className={({isActive}) => isActive ? "dashboard__enlace dashboard__enlace--actual" : "dashboard__enlace"}
        >
          <FaGift className="dashboard__icono" />
          <span className="dashboard__menu-texto">
            Regalos
          </span>
        </NavLink> */}
        
      </nav>
    </aside>
  );
}