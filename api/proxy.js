export default async function handler(req, res) {
  // Obtener la URL de destino y la ruta de la solicitud
  const targetUrl = 'https://devcommit-backend.wuaze.com/backend/public';
  // Obtener la ruta después de /api/proxy
  const path = req.url.replace(/^\/api\/proxy\/?/, '');
  // Construir URL completa
  const fullUrl = `${targetUrl}${path ? '/' + path : ''}`;
  
  console.log(`Proxy: Redirigiendo ${req.url} a ${fullUrl}`);

  try {
    // Configurar opciones para fetch
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Añadir body si es necesario
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Hacer la petición al backend
    const response = await fetch(fullUrl, fetchOptions);
    const data = await response.text();

    // Configurar cabeceras de respuesta
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json');
    
    // Intentar parsear como JSON, si falla devolver como texto
    try {
      res.status(response.status).json(JSON.parse(data));
    } catch {
      res.status(response.status).send(data);
    }
  } catch (error) {
    console.error('Error en proxy:', error);
    res.status(500).json({ error: `Error en el proxy: ${error.message}` });
  }
}