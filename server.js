import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown; charset=utf-8',
};

function getTemplate(markdownContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pavan Datta Gedila (@Pavangitu) - Profile Preview</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-dark.min.css">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    :root {
      --bg: #050505;
      --card-bg: #0c0c0e;
      --gold: #B8893F;
      --bright-gold: #F8E028;
      --crimson: #E8203A;
      --text: #F8F0E0;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .topbar {
      width: 100%;
      background: linear-gradient(90deg, #050505 0%, #15080c 50%, #050505 100%);
      border-bottom: 1px solid rgba(184, 137, 63, 0.35);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
    }
    .topbar .brand {
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 1px;
      color: var(--bright-gold);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .topbar .tag {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 12px;
      background: rgba(232, 32, 58, 0.2);
      border: 1px solid var(--crimson);
      color: #ff99a8;
    }
    .container {
      width: 100%;
      max-width: 980px;
      padding: 32px 20px 80px;
      box-sizing: border-box;
    }
    .profile-card {
      background: var(--card-bg);
      border: 1px solid rgba(184, 137, 63, 0.25);
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);
    }
    .markdown-body {
      background: transparent !important;
      color: var(--text) !important;
      font-size: 15px;
    }
    .markdown-body a {
      color: var(--bright-gold);
    }
    .markdown-body table {
      width: 100% !important;
      display: table !important;
      border-collapse: collapse;
      border-color: rgba(184, 137, 63, 0.25);
    }
    .markdown-body table th,
    .markdown-body table td {
      border: 1px solid rgba(184, 137, 63, 0.25);
      padding: 12px 14px;
    }
    .markdown-body table tr {
      background-color: transparent !important;
    }
    .markdown-body table tr:nth-child(2n) {
      background-color: rgba(255, 255, 255, 0.02) !important;
    }
    .markdown-body img {
      background-color: transparent !important;
    }
    .markdown-body hr {
      background-color: rgba(184, 137, 63, 0.25);
      height: 1px;
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <span>⚡ PAVAN DATTA GEDILA</span>
      <span class="tag">Local Dev Preview</span>
    </div>
    <div style="font-size: 13px; color: #888;">
      Port: <b>${PORT}</b> &nbsp;|&nbsp; Watching: <code>README.md</code>
    </div>
  </header>

  <main class="container">
    <div class="profile-card">
      <article id="content" class="markdown-body"></article>
    </div>
  </main>

  <script>
    const rawMarkdown = ${JSON.stringify(markdownContent)};
    marked.setOptions({
      gfm: true,
      breaks: false
    });
    document.getElementById('content').innerHTML = marked.parse(rawMarkdown);

    // Auto-refresh when tab is focused
    let lastModified = Date.now();
    window.addEventListener('focus', () => {
      fetch('/api/status').then(r => r.json()).then(data => {
        if (data.mtime > lastModified) {
          window.location.reload();
        }
      }).catch(() => {});
    });
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Status API for hot polling
  if (pathname === '/api/status') {
    const readmePath = path.join(__dirname, 'README.md');
    try {
      const stat = fs.statSync(readmePath);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ mtime: stat.mtimeMs }));
      return;
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ mtime: Date.now() }));
      return;
    }
  }

  // Home page: render README.md
  if (pathname === '/' || pathname === '/index.html') {
    const readmePath = path.join(__dirname, 'README.md');
    fs.readFile(readmePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading README.md');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(getTemplate(data));
    });
    return;
  }

  // Serve static assets
  let filePath = path.join(__dirname, pathname);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('\n  ⚡ PAVAN DATTA GEDILA - Developer Profile Server');
  console.log(`  ➜  Local:   http://localhost:${PORT}/`);
  console.log(`  ➜  Watching: README.md, ./assets, ./images`);
  console.log('  ➜  Press Ctrl+C to stop\n');
});
