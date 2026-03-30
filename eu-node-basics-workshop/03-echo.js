const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  // Парсимо URL запиту. 
  // 'http://localhost' тут просто як заглушка для базового домену, щоб парсер працював з відносними шляхами
  const url = new URL(req.url, 'http://localhost');

  // Зверни увагу: тепер ми перевіряємо url.pathname замість req.url
  if (req.method === 'GET' && url.pathname === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to Manual HTTP Router');
  } 
  else if (req.method === 'GET' && url.pathname === '/time') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ now: new Date().toISOString() }));
  } 
  // НОВИЙ РОУТ: GET /echo
  else if (req.method === 'GET' && url.pathname === '/echo') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    // Витягуємо параметр 'msg'. Якщо його немає, повертаємо порожній рядок ''
    const msg = url.searchParams.get('msg') || '';
    
    res.end(msg);
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});