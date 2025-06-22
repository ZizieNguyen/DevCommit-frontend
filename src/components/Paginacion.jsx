export default function Paginacion({ 
  paginaActual = 1, 
  totalPaginas = 1,
  onChange 
}) {
  // Genera un array con los números de página a mostrar
  const generarPaginas = () => {
    const delta = 2; // Cuántas páginas mostrar antes y después de la actual
    let paginas = [];
    
    // Siempre mostrar primera página
    paginas.push(1);
    
    // Calcular rango alrededor de la página actual
    for (let i = Math.max(2, paginaActual - delta); i <= Math.min(totalPaginas - 1, paginaActual + delta); i++) {
      paginas.push(i);
    }
    
    // Siempre mostrar última página si hay más de una
    if (totalPaginas > 1) {
      paginas.push(totalPaginas);
    }
    
    // Ordenar y eliminar duplicados
    paginas = [...new Set(paginas)].sort((a, b) => a - b);
    
    // Añadir separadores
    const paginasConSeparadores = [];
    for (let i = 0; i < paginas.length; i++) {
      paginasConSeparadores.push(paginas[i]);
      
      // Añadir separador si hay un salto mayor que 1
      if (paginas[i + 1] && paginas[i + 1] > paginas[i] + 1) {
        paginasConSeparadores.push('...');
      }
    }
    
    return paginasConSeparadores;
  };
  
  if (totalPaginas <= 1) return null;
  
  return (
    <div className="paginacion">
      {/* Primera página */}
      <button 
        onClick={() => onChange(1)} 
        disabled={paginaActual === 1}
        className="paginacion__boton paginacion__boton--extremo"
        aria-label="Primera página"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>
      
      {/* Página anterior */}
      <button 
        onClick={() => onChange(paginaActual - 1)} 
        disabled={paginaActual === 1}
        className="paginacion__boton paginacion__boton--navegacion"
        aria-label="Página anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>
      
      {/* Números de página */}
      <div className="paginacion__numeros">
        {generarPaginas().map((pagina, index) => (
          pagina === '...' ? (
            <span key={`ellipsis-${index}`} className="paginacion__ellipsis">
              {pagina}
            </span>
          ) : (
            <button
              key={`page-${pagina}`}
              onClick={() => onChange(pagina)}
              className={`paginacion__boton ${paginaActual === pagina ? 'paginacion__boton--activo' : ''}`}
              aria-label={`Página ${pagina}`}
              aria-current={paginaActual === pagina}
            >
              {pagina}
            </button>
          )
        ))}
      </div>
      
      {/* Página siguiente */}
      <button
        onClick={() => onChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="paginacion__boton paginacion__boton--navegacion"
        aria-label="Página siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
      
      {/* Última página */}
      <button
        onClick={() => onChange(totalPaginas)}
        disabled={paginaActual === totalPaginas}
        className="paginacion__boton paginacion__boton--extremo"
        aria-label="Última página"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
          <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>
  );
}