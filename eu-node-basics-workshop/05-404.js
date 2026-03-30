const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // 1. Маршрут: GET /
  if (req.method === 'GET' && url.pathname === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to Manual HTTP Router');
  } 
  // 2. Маршрут: GET /time
  else if (req.method === 'GET' && url.pathname === '/time') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ now: new Date().toISOString() }));
  } 
  // 3. Маршрут: GET /echo
  else if (req.method === 'GET' && url.pathname === '/echo') {
    const msg = url.searchParams.get('msg') || '';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(msg);
  } 
  // 4. Маршрут: GET /sum
  else if (req.method === 'GET' && url.pathname === '/sum') {
    const aParam = url.searchParams.get('a');
    const bParam = url.searchParams.get('b');
    const a = Number(aParam);
    const b = Number(bParam);

    if (aParam === null || bParam === null || Number.isNaN(a) || Number.isNaN(b)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid numbers' }));
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ sum: a + b }));
    }
  } 
  // 5. ФІНАЛЬНИЙ FALLBACK: 404 Not Found
  // Сюди потраплять усі інші шляхи або методи (POST, PUT тощо)
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});