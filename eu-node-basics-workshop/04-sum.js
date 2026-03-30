const http = require('http');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // Старі маршрути для підтримки структури
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
  else if (req.method === 'GET' && url.pathname === '/echo') {
    const msg = url.searchParams.get('msg') || '';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(msg);
  } 
  // НОВИЙ РОУТ: GET /sum
  else if (req.method === 'GET' && url.pathname === '/sum') {
    // Отримуємо параметри
    const aParam = url.searchParams.get('a');
    const bParam = url.searchParams.get('b');
    
    // Перетворюємо їх на числа
    const a = Number(aParam);
    const b = Number(bParam);

    // Перевірка: чи параметри існують і чи вони є валідними числами
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
});

server.listen(port);