// Підключаємо вбудований модуль для роботи з HTTP
const http = require('http')

// Отримуємо URL (адресу сайту) з аргументів командного рядка
const url = process.argv[2]

// Робимо GET-запит на цю адресу
http.get(url, function (response) {
  
  // Вказуємо, що ми хочемо отримувати нормальний текст (utf8), а не незрозумілі байти
  response.setEncoding('utf8')

  // Коли сервер надсилає черговий "шматочок" даних (подія 'data'), виводимо його
  response.on('data', function (data) {
    console.log(data)
  })
  
  // На випадок, якщо щось піде не так, виводимо помилку
  response.on('error', function (error) {
    console.error(error)
  })
  
})