// Підключаємо вбудований модуль для створення TCP-серверів
const net = require('net')

// Допоміжна функція, яка додає '0' перед числом, якщо воно менше 10
function zeroFill(i) {
  return (i < 10 ? '0' : '') + i
}

// Функція, яка генерує поточну дату у потрібному форматі
function now() {
  const date = new Date()
  
  return date.getFullYear() + '-' +
    zeroFill(date.getMonth() + 1) + '-' + // Не забуваємо +1 до місяця!
    zeroFill(date.getDate()) + ' ' +
    zeroFill(date.getHours()) + ':' +
    zeroFill(date.getMinutes())
}

// Створюємо сам сервер
const server = net.createServer(function (socket) {
  // Коли хтось підключається, ми беремо нашу дату, додаємо символ нового рядка '\n',
  // відправляємо це підключеному клієнту і одразу закриваємо з'єднання (end)
  socket.end(now() + '\n')
})

// Кажемо серверу "слухати" порт, який нам передасть програма-перевіряльник у першому аргументі
server.listen(Number(process.argv[2]))