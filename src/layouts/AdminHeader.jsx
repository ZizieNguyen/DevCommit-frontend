import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AdminHeader() {
  const { auth, logout } = useAuth();
  
  if(!auth) return null;
  
  return (
    <header className="dashboard__header">
      <div className="dashboard__header-grid">
        <Link to="/">
          <h2 className="dashboard__logo">
            &#60;DevCommit /&#62;
          </h2>
        </Link>

        <nav className="dashboard__nav">
          <div className="dashboard__form">
            <button 
              type="button"
              className="dashboard__submit--logout"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}