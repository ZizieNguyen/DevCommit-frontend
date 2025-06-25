export default async function handler(req, res) {
  // URL base del backend
  const targetUrl = 'https://devcommit-backend.wuaze.com/backend/public';
  
  // 1. Extraer la parte de la URL después de /api/proxy
  const path = req.url.replace(/^\/api\/proxy\/?/, '');
  
  // 2. Eliminar el prefijo "api/" si existe en el path
  const cleanPath = path.startsWith('api/') ? path.substring(4) : path;
  
  // 3. Construir la URL completa, agregando /api/ en el medio
  const fullUrl = `${targetUrl}/api/${cleanPath}`;
  
  console.log(`[Proxy] Redirigiendo: ${req.url} → ${fullUrl}`);

  try {
    // Configuración de la petición
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Añadir body para peticiones POST, PUT, etc.
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Hacer la petición al backend
    const response = await fetch(fullUrl, fetchOptions);
    const data = await response.text();

    // Devolver la respuesta
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json');
    
    try {
      res.status(response.status).json(JSON.parse(data));
    } catch {
      res.status(response.status).send(data);
    }
  } catch (error) {
    console.error('[Proxy] Error:', error);
    res.status(500).json({ error: `Error en el proxy: ${error.message}` });
  }
}