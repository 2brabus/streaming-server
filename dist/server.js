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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const port = 3000;
const server = http.createServer((req, res) => {
    // Ręczna obsługa CORS dla preflight
    if (req.method === 'OPTIONS' && req.url === '/api/echo-stream') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, bypass-tunnel-reminder',
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
    // Serwowanie plików statycznych
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url || '');
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.ts': 'application/x-typescript',
    };
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404: File Not Found', 'utf-8');
            }
            else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
