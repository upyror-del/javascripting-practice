const http = require('http')
const fs = require('fs')

// Отримуємо порт та шлях до файлу з аргументів
const port = process.argv[2]
const filePath = process.argv[3]

const server = http.createServer(function (req, res) {
  // Встановлюємо статус 200 (ОК) і тип контенту (звичайний текст)
  res.writeHead(200, { 'content-type': 'text/plain' })

  // Створюємо потік для читання файлу
  const fileStream = fs.createReadStream(filePath)

  // "Приєднуємо" потік файлу до потоку відповіді (response)
  // Дані будуть передаватися шматочками автоматично
  fileStream.pipe(res)
})

// Запускаємо сервер
server.listen(Number(port))