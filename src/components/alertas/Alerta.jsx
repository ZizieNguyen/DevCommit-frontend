export default function Alerta({tipo, mensaje}) {
  const clasesPorTipo = {
    error: 'alerta__error',
    exito: 'alerta__exito'
  };
  
  return (
    <div className={`alerta ${clasesPorTipo[tipo] || 'alerta__error'}`}>
      <p>{mensaje}</p>
    </div>
  );
}