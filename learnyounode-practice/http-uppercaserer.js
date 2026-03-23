const http = require('http')
const map = require('through2-map')

const port = process.argv[2]

const server = http.createServer(function (req, res) {
  // Перевіряємо, чи це POST-запит (як просить умова)
  if (req.method !== 'POST') {
    return res.end('Будь ласка, надішліть мені POST-запит\n')
  }

  // Використовуємо "магічну трубу" pipe
  // Вона бере дані з запиту (req), проганяє через map і відправляє у відповідь (res)
  req.pipe(map(function (chunk) {
    // chunk — це "шматочок" даних. Перетворюємо його в рядок і робимо ВЕЛИКИМ.
    return chunk.toString().toUpperCase()
  })).pipe(res)
})

server.listen(Number(port))
