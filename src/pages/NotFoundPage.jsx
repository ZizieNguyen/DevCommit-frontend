import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import '../styles/404.css';

export const NotFoundPage = () => {
  return (
    <section className="pagina-404">
      <div className="pagina-404__contenedor">
        <FaExclamationTriangle className="pagina-404__icono" />
        
        <h1 className="pagina-404__titulo">404</h1>
        
        <p className="pagina-404__texto">
          La página que estás buscando no existe o fue movida
        </p>
        
        <div className="pagina-404__boton-contenedor">
          <Link to="/" className="boton boton--secundario">
            <FaHome className="pagina-404__boton-icono" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;