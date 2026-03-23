// Підключаємо модуль для роботи з файловою системою
const fs = require('fs')

// process.argv[2] містить шлях до файлу, який нам підсуне програма-перевіряльник
// readFileSync читає цей файл синхронно (зупиняє програму, поки не прочитає)
const buffer = fs.readFileSync(process.argv[2])

// Перетворюємо прочитані дані (Buffer) на звичайний текст
const str = buffer.toString()

// Розбиваємо текст на масив по символу переносу рядка ('\n')
const linesArray = str.split('\n')

// Оскільки розбиття дає на 1 елемент більше, ніж самих переносів, віднімаємо 1
const numberOfLines = linesArray.length - 1

// Виводимо результат у консоль
console.log(numberOfLines)