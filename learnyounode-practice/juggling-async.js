const http = require('http')

// Зберігаємо наші три посилання в масив (починаються з індексу 2)
const urls = [process.argv[2], process.argv[3], process.argv[4]]

// Створюємо порожній масив для результатів і лічильник
const results = []
let count = 0

// Функція, яка виведе всі результати по черзі, коли всі три завантажаться
function printResults () {
  for (let i = 0; i < 3; i++) {
    console.log(results[i])
  }
}

// Функція, яка робить запит для конкретного посилання за його номером (index)
function httpGet (index) {
  http.get(urls[index], function (response) {
    response.setEncoding('utf8')
    let rawData = ''

    // Збираємо шматочки даних
    response.on('data', function (chunk) {
      rawData += chunk
    })

    // Коли сервер завершив передачу
    response.on('end', function () {
      // Записуємо зібраний текст у масив на ПРАВИЛЬНЕ місце (0, 1 або 2)
      results[index] = rawData
      // Збільшуємо лічильник завершених запитів
      count++

      // Якщо всі 3 запити завершилися успішно — друкуємо результат
      if (count === 3) {
        printResults()
      }
    })
  })
}

// Запускаємо цикл, який відправить одразу 3 запити одночасно
for (let i = 0; i < 3; i++) {
  httpGet(i)
}