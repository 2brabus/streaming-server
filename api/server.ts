import * as http from 'http';

const server = http.createServer((req, res) => {
  // Ręczna obsługa CORS dla preflight
  if (req.method === 'OPTIONS' && req.url === '/api/echo-stream') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Obsługa endpointu POST
  if (req.method === 'POST' && req.url === '/api/echo-stream') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      const chunks = [
        "Server Acknowledges: '",
        body,
        "'. ",
        "Received successfully.",
      ];

      let i = 0;
      const interval = setInterval(() => {
        if (i < chunks.length) {
          res.write(chunks[i]);
          i++;
        } else {
          clearInterval(interval);
          res.end();
        }
      }, 200);
    });
    return;
  }

  // Jeśli żądanie nie pasuje do żadnej trasy API, Vercel automatycznie obsłuży pliki statyczne z katalogu 'public'
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404: API Route Not Found', 'utf-8');
});

export default server;
