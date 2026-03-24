/**
 * Mock npm Registry Server
 * Імітує локальний npm registry для how-to-npm вправ
 * 
 * Запуск: node mock-npm-server.js
 * Потім в іншому терміналі:
 *   npm config set registry http://localhost:15443
 *   how-to-npm.cmd verify
 */

const http = require("http");
const url = require("url");

const PORT = 15443;

// --- Стан сервера ---
let loggedInUser = null;
const users = {}; // { username: { password, email } }
const packages = {}; // { name: { versions: { "1.0.0": {...} }, dist-tags: {} } }

// --- Кольори для логів ---
const C = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

function log(method, path, status) {
  const color = status >= 400 ? C.red : status >= 300 ? C.yellow : C.green;
  console.log(
    `${C.gray}[${new Date().toISOString()}]${C.reset} ` +
    `${C.cyan}${method.padEnd(6)}${C.reset} ` +
    `${path.padEnd(40)} ` +
    `${color}${status}${C.reset}`
  );
}

// --- Парсинг Basic Auth або Bearer токена ---
function parseAuth(req) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const [username, password] = decoded.split(":");
    return { type: "basic", username, password };
  }
  if (auth.startsWith("Bearer ")) {
    const token = auth.slice(7);
    // Токен = base64(username:password)
    try {
      const decoded = Buffer.from(token, "base64").toString("utf8");
      const [username] = decoded.split(":");
      return { type: "bearer", username, token };
    } catch {
      return null;
    }
  }
  return null;
}

// --- Читання тіла запиту ---
function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

// --- JSON відповідь ---
function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
  });
  res.end(json);
}

// ===== РОУТЕР =====
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const method = req.method;

  // --- /-/ping  (перевірка чи сервер живий) ---
  if (pathname === "/-/ping") {
    log(method, pathname, 200);
    return send(res, 200, { ok: true });
  }

  // --- /-/user/org.couchdb.user:USERNAME  (adduser / login) ---
  if (pathname.startsWith("/-/user/org.couchdb.user:") && method === "PUT") {
    const body = await readBody(req);
    const username = body.name || pathname.split(":")[1];
    const password = body.password || "";
    const email = body.email || "";

    if (!username || !password) {
      log(method, pathname, 400);
      return send(res, 400, { error: "username and password required" });
    }

    users[username] = { password, email };
    loggedInUser = username;

    const token = Buffer.from(`${username}:${password}`).toString("base64");
    console.log(`${C.green}✔ Registered/logged in as: ${username}${C.reset}`);
    log(method, pathname, 201);
    return send(res, 201, {
      ok: true,
      id: `org.couchdb.user:${username}`,
      rev: "_we_dont_revisions_here",
      token,
    });
  }

  // --- /-/whoami ---
  if (pathname === "/-/whoami" && method === "GET") {
    const auth = parseAuth(req);
    if (!auth) {
      log(method, pathname, 401);
      return send(res, 401, { error: "not logged in" });
    }
    const user = auth.username || loggedInUser;
    log(method, pathname, 200);
    return send(res, 200, { username: user });
  }

  // --- DELETE /-/user/token/...  (logout) ---
  if (pathname.startsWith("/-/user/token/") && method === "DELETE") {
    loggedInUser = null;
    log(method, pathname, 200);
    return send(res, 200, { ok: true });
  }

  // --- GET /:packageName  (пошук пакету) ---
  if (method === "GET" && !pathname.startsWith("/-/")) {
    const pkgName = decodeURIComponent(pathname.slice(1));
    if (packages[pkgName]) {
      log(method, pathname, 200);
      return send(res, 200, packages[pkgName]);
    }
    // Повертаємо порожній пакет щоб npm не падав
    log(method, pathname, 404);
    return send(res, 404, { error: "not found" });
  }

  // --- PUT /:packageName  (publish) ---
  if (method === "PUT" && !pathname.startsWith("/-/")) {
    const auth = parseAuth(req);
    if (!auth) {
      log(method, pathname, 401);
      return send(res, 401, { error: "authentication required" });
    }
    const body = await readBody(req);
    const pkgName = decodeURIComponent(pathname.slice(1));
    packages[pkgName] = packages[pkgName] || { name: pkgName, versions: {}, "dist-tags": {} };

    const newVersions = body.versions || {};
    Object.assign(packages[pkgName].versions, newVersions);
    Object.assign(packages[pkgName]["dist-tags"], body["dist-tags"] || {});

    console.log(`${C.green}✔ Published: ${pkgName}${C.reset}`);
    log(method, pathname, 200);
    return send(res, 200, { ok: true });
  }

  // --- Все інше ---
  log(method, pathname, 404);
  send(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  console.log(`
${C.cyan}╔══════════════════════════════════════════════╗
║       Mock npm Registry Server               ║
║       http://localhost:${PORT}              ║
╚══════════════════════════════════════════════╝${C.reset}

${C.yellow}Щоб використовувати цей сервер, виконай у терміналі:${C.reset}

  ${C.green}npm config set registry http://localhost:${PORT}${C.reset}

${C.yellow}Потім продовжуй how-to-npm вправи як звичайно:${C.reset}

  ${C.green}npm adduser${C.reset}          ← реєстрація (будь-який username/password)
  ${C.green}npm whoami${C.reset}           ← перевірка входу
  ${C.green}how-to-npm.cmd verify${C.reset}

${C.yellow}Щоб повернутись до реального npm registry:${C.reset}

  ${C.green}npm config set registry https://registry.npmjs.org${C.reset}

${C.gray}Очікую запити...${C.reset}
`);
});
