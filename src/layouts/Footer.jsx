import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaGithub } from 'react-icons/fa';
import '../styles/footer.css'

const Footer = () => {
  const año = new Date().getFullYear();

  return (
    <footer className="footer mt-auto">
      <div className="footer__grid">
        <div className="footer__contenido">
          <h3 className="footer__logo">
            <span className="footer__logo--bold">&#60;DevCommit/&#62;</span>
          </h3>

          <p className="footer__texto">
            DevCommit es una conferencia para desarrolladores de todos los niveles, 
            con charlas y talleres dictados por expertos en la industria.
          </p>
        </div>

        <nav className="menu-redes">
          <a 
            className="menu-redes__enlace" 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaFacebook className="menu-redes__icono" />
            <span className="menu-redes__ocultar">Facebook</span>
          </a>
          <a 
            className="menu-redes__enlace" 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaTwitter className="menu-redes__icono" />
            <span className="menu-redes__ocultar">Twitter</span>
          </a>
          <a 
            className="menu-redes__enlace" 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaYoutube className="menu-redes__icono" />
            <span className="menu-redes__ocultar">YouTube</span>
          </a>
          <a 
            className="menu-redes__enlace" 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaInstagram className="menu-redes__icono" />
            <span className="menu-redes__ocultar">Instagram</span>
          </a>
          <a 
            className="menu-redes__enlace" 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaGithub className="menu-redes__icono" />
            <span className="menu-redes__ocultar">GitHub</span>
          </a>
        </nav>
      </div>

      <p className="footer__copyright">
        DevCommit
        <span className="footer__copyright--regular"> - Todos los derechos reservados {año}</span>
      </p>
    </footer>
  );
};

export default Footer;