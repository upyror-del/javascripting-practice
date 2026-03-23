const http = require('http')

// Допоміжна функція для формату /api/parsetime
function parsetime (time) {
  return {
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds()
  }
}

// Допоміжна функція для формату /api/unixtime
function unixtime (time) {
  return { unixtime: time.getTime() }
}

const server = http.createServer(function (req, res) {
  // Розбираємо URL. Використовуємо фіктивний домен, щоб URL став абсолютним
  const url = new URL(req.url, 'http://example.com')
  const time = new Date(url.searchParams.get('iso'))
  let result

  // Перевіряємо шлях (pathname) запиту
  if (url.pathname === '/api/parsetime') {
    result = parsetime(time)
  } else if (url.pathname === '/api/unixtime') {
    result = unixtime(time)
  }

  // Якщо шлях вірний — повертаємо JSON
  if (result) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  } else {
    // Якщо шлях невідомий — повертаємо помилку 404
    res.writeHead(404)
    res.end()
  }
})

server.listen(Number(process.argv[2]))