// Підключаємо відразу два модулі
const fs = require('fs')
const path = require('path')

// Отримуємо шлях до папки (перший аргумент)
const folder = process.argv[2]
// Отримуємо потрібне розширення (другий аргумент). 
// Додаємо крапку на початку, бо програма передає 'txt', а path.extname шукає '.txt'
const ext = '.' + process.argv[3]

// Читаємо вміст папки асинхронно
fs.readdir(folder, function (err, files) {
  if (err) {
    return console.error(err)
  }
  
  // Проходимося по кожному знайденому файлу за допомогою циклу forEach
  files.forEach(function (file) {
    // Якщо розширення файлу збігається з нашим — виводимо його в консоль
    if (path.extname(file) === ext) {
      console.log(file)
    }
  })
})