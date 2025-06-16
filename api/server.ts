import * as http from 'http';

const server = http.createServer((req, res) => {
  // Ręczna obsługa CORS dla preflight
  if (req.method === 'OPTIONS' && req.url === '/api/diagram-test') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Nowy endpoint do streamowania diagramu JSON
  if (req.method === 'GET' && req.url === '/api/diagram-test') {
    const diagramData = {
      nodes: [
        { id: "n1", label: "Node 1", x: 50, y: 50, color: "skyblue" },
        { id: "n2", label: "Node 2", x: 250, y: 100, color: "lightgreen" },
        { id: "n3", label: "Test Node", x: 150, y: 150, color: "orange" }
      ],
      edges: [
        { from: "n1", to: "n2", label: "Connects", color: "gray" }
      ],
      width: 400,
      height: 200
    };

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(diagramData, null, 2));
    return;
  }

  // Jeśli żądanie nie pasuje do żadnej trasy API, Vercel automatycznie obsłuży pliki statyczne z katalogu 'public'
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404: API Route Not Found', 'utf-8');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default server;
