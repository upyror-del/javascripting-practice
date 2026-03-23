let sum = 0

// Починаємо цикл з індексу 2, бо 0 і 1 нам не потрібні
for (let i = 2; i < process.argv.length; i++) {
  // Number() перетворює рядок на число, щоб ми могли їх додавати, а не склеювати
  sum += Number(process.argv[i])
}
