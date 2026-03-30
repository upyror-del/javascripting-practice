const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  // Попередній маршрут (GET /)
  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to Manual HTTP Router');
  } 
  // Новий маршрут (GET /time)
  else if (req.method === 'GET' && req.url === '/time') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    
    // Створюємо об'єкт із поточним часом
    const data = { 
      now: new Date().toISOString() 
    };
    
    // Відправляємо JSON
    res.end(JSON.stringify(data));
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});