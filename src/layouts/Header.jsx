import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import '../styles/header.css'; 

export default function Header() {
  const { auth, logout } = useAuth();
  const [menuMobile, setMenuMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const isPaginaPrincipal = location.pathname === '/';
  const isAdmin = auth?.admin === true || auth?.admin === "1" || auth?.admin === 1 || auth?.admin === "true";
  
  // Detectar scroll para efectos visuales
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Cerrar menú al navegar
  useEffect(() => setMenuMobile(false), [location.pathname]);
  
  return (
    <div className={isAdmin ? 'is-admin' : ''}>
      <>
        {/* Header principal con imagen de fondo */}
        <header className={`${isPaginaPrincipal ? 'header' : 'header header--interno'} ${isAdmin ? 'is-admin' : ''}`}>
          <div className="header__contenedor">
            <div className="header__barra">
              <div className="header__logo">
                <Link to="/">
                  <h1 className="header__heading">
                    <span className="header__heading--bold">&#60;DevCommit/&#62;</span>
                  </h1>
                </Link>
              </div>

              <nav className="navegacion-principal">
                {auth?.id ? (
                  <>
                    {isAdmin && (
                      <Link 
                        to="/admin/dashboard"
                        className="navegacion-principal__enlace "
                      >
                        Administrar
                      </Link>
                    )}
                    <button 
                      type="button"
                      className="navegacion-principal__enlace navegacion-principal__enlace--logout"
                      onClick={logout}
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="registro" className="navegacion-principal__enlace">
                      Registro
                    </Link>
                    <Link to="login" className="navegacion-principal__enlace">
                      Iniciar Sesión
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {isPaginaPrincipal && (
              <div className="header__contenido">
                <h2 className="header__evento">
                  Conferencia para Desarrolladores - Octubre 5-6 - 2025
                </h2>
                
                <p className="header__texto">
                  Disfruta de las conferencias y talleres impartidos por expertos en desarrollo web
                </p>
                
                <div className="header__button--container">
                  <Link to="/eventos" className="header__button">
                    Explorar Eventos
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Barra de navegación principal - se fija al hacer scroll */}
        <div className={`barra ${scrolled ? 'barra--fija' : ''}`}>
          <div className="barra__contenedor">
            <div className="barra__logo">
              <Link to="/">
                <h2 className="barra__heading">
                  Dev<span className="barra__heading--bold">Commit</span>
                </h2>
              </Link>
            </div>

            <nav className="navegacion">
              <NavLink 
                to="/sobre" 
                className={({isActive}) => isActive ? 
                  'navegacion__enlace navegacion__enlace--actual' : 'navegacion__enlace'
                }
              >
                Sobre DevCommit
              </NavLink>

              <NavLink 
                to="/eventos" 
                className={({isActive}) => isActive ? 
                  'navegacion__enlace navegacion__enlace--actual' : 'navegacion__enlace'
                }
              >
                Eventos
              </NavLink>

              <NavLink 
                to="/paquetes" 
                className={({isActive}) => isActive ? 
                  'navegacion__enlace navegacion__enlace--actual' : 'navegacion__enlace'
                }
              >
                Paquetes
              </NavLink>

              <NavLink 
                to="/ponentes" 
                className={({isActive}) => isActive ? 
                  'navegacion__enlace navegacion__enlace--actual' : 'navegacion__enlace'
                }
              >
                Ponentes
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Botón menú móvil */}
        <div className="menu-mobile">
          <FaBars 
            className={`menu-mobile__icono ${menuMobile ? 'hidden' : 'block'}`}
            onClick={() => setMenuMobile(true)}
            aria-label="Abrir menú"
          />
        </div>

        {/* Menú móvil */}
        <div className={`menu-mobile__contenedor ${menuMobile ? 'menu-mobile--visible' : ''}`}>
          <IoMdClose 
            className="menu-mobile__cerrar"
            onClick={() => setMenuMobile(false)}
            aria-label="Cerrar menú"
          />

          <nav className="menu-mobile__nav">
            <NavLink 
              to="/eventos" 
              className={({isActive}) => isActive ? 
                'menu-mobile__enlace menu-mobile__enlace--actual' : 'menu-mobile__enlace'
              }
            >
              Eventos
            </NavLink>

            <NavLink 
              to="/paquetes" 
              className={({isActive}) => isActive ? 
                'menu-mobile__enlace menu-mobile__enlace--actual' : 'menu-mobile__enlace'
              }
            >
              Paquetes
            </NavLink>

            <NavLink 
              to="/workshops" 
              className={({isActive}) => isActive ? 
                'menu-mobile__enlace menu-mobile__enlace--actual' : 'menu-mobile__enlace'
              }
            >
              Workshops / Conferencias
            </NavLink>

            <NavLink 
              to="/ponentes" 
              className={({isActive}) => isActive ? 
                'menu-mobile__enlace menu-mobile__enlace--actual' : 'menu-mobile__enlace'
              }
            >
              Ponentes
            </NavLink>

            {auth?.id ? (
              <>
                {isAdmin && (
                  <NavLink 
                    to="/admin/dashboard"
                    className="menu-mobile__enlace menu-mobile__enlace--registrar "
                  >
                    Administrar
                  </NavLink>
                )}
                <button
                  type="button"
                  className="menu-mobile__enlace menu-mobile__enlace--logout" 
                  onClick={logout}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/registro" 
                  className="menu-mobile__enlace menu-mobile__enlace--registrar"
                >
                  Registro
                </Link>
                <Link 
                  to="/login" 
                  className="menu-mobile__enlace menu-mobile__enlace--login"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </nav>
        </div>
      </>
    </div>
  );
}