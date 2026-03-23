const http = require('http')

const url = process.argv[2]

http.get(url, function (response) {
  // Знову просимо текст, а не байти
  response.setEncoding('utf8')

  // Створюємо порожній рядок (наш "кошик" для даних)
  let rawData = ''

  // Щоразу, коли приходить новий шматочок, приклеюємо його до нашого рядка
  response.on('data', function (chunk) {
    rawData += chunk
  })

  // Коли сервер надсилає подію 'end' (це означає, що передача завершена)
  response.on('end', function () {
    // Виводимо перший рядок: кількість символів (довжина рядка)
    console.log(rawData.length)
    // Виводимо другий рядок: весь зібраний текст
    console.log(rawData)
  })

  // Ловимо можливі помилки
  response.on('error', function (error) {
    console.error(error)
  })
})