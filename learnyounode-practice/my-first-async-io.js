const fs = require('fs')

// Читаємо файл асинхронно. 
// Другий аргумент 'utf8' одразу перетворює дані на текст.
// Третій аргумент — це та сама функція зворотного виклику (callback), яка спрацює, коли файл буде прочитано.
fs.readFile(process.argv[2], 'utf8', function (err, data) {
  // Якщо під час читання сталася помилка — виводимо її
  if (err) {
    return console.log(err)
  }
  
  // Якщо помилок немає, data містить текст файлу. Рахуємо рядки.
  const lines = data.split('\n').length - 1
  
  console.log(lines)
})