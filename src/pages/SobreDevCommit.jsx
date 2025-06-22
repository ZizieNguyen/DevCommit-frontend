import React from 'react';
import '../styles/sobre.css'

export default function SobreDevCommit() {
  return (
    <main className="devcommit">
      <h2 className="devcommit__heading">Sobre DevCommit</h2>
      <p className="devcommit__descripcion">Conoce la conferencia más importante de España</p>

      <div className="devcommit__grid">
        <div className="devcommit__imagen">
          <img 
            src="/img/sobre_devcommit.jpg" 
            alt="Imagen DevCommit" 
            loading="lazy"
          />
        </div>

        <div className="devcommit__contenido">
          <p className="devcommit__texto">DevCommit es el punto de encuentro anual para desarrolladores, diseñadores y líderes tecnológicos de toda Latinoamérica. Con más de 50 ponencias y talleres impartidos por expertos internacionales, esta conferencia ofrece una oportunidad única para aprender sobre las últimas tendencias en desarrollo web, móvil, inteligencia artificial y ciberseguridad. Desde 2018, hemos reunido a más de 10,000 profesionales de la tecnología en un espacio diseñado para fomentar la colaboración y el intercambio de conocimientos.</p>
          
          <p className="devcommit__texto">Nuestro objetivo es impulsar el crecimiento de la comunidad tecnológica latinoamericana, proporcionando acceso a conocimiento de vanguardia y creando oportunidades de networking entre profesionales, empresas y startups. En cada edición de DevCommit, nos esforzamos por crear un ambiente inclusivo donde todos los participantes puedan conectar, aprender y desarrollarse profesionalmente. ¡Te invitamos a formar parte de esta experiencia transformadora y contribuir al futuro de la tecnología en nuestra región!</p>
        </div>
      </div>
    </main>
  );
}