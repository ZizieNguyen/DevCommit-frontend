export default async function handler(req, res) {
  // Extraer información de la solicitud
  const { url, method, headers, query, body } = req;
  
  // Construir la URL del backend
  const targetUrl = 'https://devcommit-backend.wuaze.com/backend/public';
  
  // Extraer la ruta solicitada (todo después de /api/proxy)
  const path = url.replace(/^\/api\/proxy/, '');
  
  // Construir la URL completa
  const fullUrl = `${targetUrl}${path}`;
  
  try {
    // Configurar opciones para fetch
    const fetchOptions = {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Eliminar cabeceras que podrían causar problemas
        ...Object.fromEntries(
          Object.entries(headers).filter(([key]) => 
            !['host', 'connection', 'content-length'].includes(key.toLowerCase())
          )
        )
      }
    };
    
    // Agregar body para métodos que lo requieran
    if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    // Realizar la petición al backend
    const response = await fetch(fullUrl, fetchOptions);
    
    // Obtener los datos de respuesta
    const data = await response.text();
    
    // Establecer el código de estado y devolver los datos
    res.status(response.status);
    
    try {
      // Intentar parsear como JSON
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch{
      // Si no es JSON válido, devolver como texto
      res.send(data);
    }
  } catch (error) {
    console.error('Error en proxy:', error);
    res.status(500).json({ 
      error: true, 
      message: error.message,
      details: 'Error al conectar con el backend'
    });
  }
}