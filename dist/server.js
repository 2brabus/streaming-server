"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const server = http.createServer((req, res) => {
    // Ręczna obsługa CORS dla preflight
    if (req.method === 'OPTIONS' && (req.url === '/api/echo-stream' || req.url === '/api/stream-panel' || req.url === '/api/diagram-test' || req.url === '/api/panels')) {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
                }
                else {
                    clearInterval(interval);
                    res.end();
                }
            }, 200);
        });
        return;
    }
    // Nowy endpoint do streamowania panelu
    if (req.method === 'GET' && req.url === '/api/stream-panel') {
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        let count = 0;
        const interval = setInterval(() => {
            count++;
            res.write(`Update #${count}: System status is nominal. Current time: ${new Date().toLocaleTimeString()}\n`);
            if (count === 10) {
                clearInterval(interval);
                res.end('Stream finished.');
            }
        }, 1000);
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
    // Nowy endpoint do paneli
    if (req.method === 'GET' && req.url === '/api/panels') {
        const panelData = [
            { "id": "uniquePanelId1", "name": "Display Name for Panel 1" },
            { "id": "uniquePanelId2", "name": "Display Name for Panel 2" }
        ];
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify(panelData, null, 2));
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
exports.default = server;
