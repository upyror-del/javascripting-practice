const http = require('http');

// Отримуємо порт з першого аргументу командного рядка
// Нагадування: process.argv[0] - шлях до node, process.argv[1] - шлях до файлу, [2] - наш порт
const port = process.argv[2];

const server = http.createServer((req, res) => {
    // Перевіряємо метод та шлях згідно з вимогами
    if (req.method === 'GET' && req.url === '/') {
        // Встановлюємо статус-код 200
        res.statusCode = 200;

        // Встановлюємо заголовок Content-Type
        res.setHeader('Content-Type', 'text/plain');

        // Відправляємо тіло відповіді
        res.end('Welcome to Manual HTTP Router');
    }
});

// Запускаємо сервер на вказаному порту
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});