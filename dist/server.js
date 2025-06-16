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
    if (req.method === 'OPTIONS' && (req.url === '/api/echo-stream' || req.url === '/api/stream-panel' || req.url === '/api/diagram-test' || req.url === '/api/plan')) {
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
    // Nowy endpoint do planu
    if (req.method === 'GET' && req.url === '/api/plan') {
        const planData = {
            "dasp_strategic_plan_v6": {
                "metadata": {
                    "version": "6.0",
                    "author": "Gemini Architect",
                    "last_updated": "2025-06-16T02:07:05Z",
                    "description": "Strategiczny, turowy plan budowy szkieletu architektury DASP. Każdy ruch jest silną sugestią, ale ostateczna decyzja i udoskonalenie należą do agenta wykonawczego."
                },
                "preamble": {
                    "title": "KONSTYTUCJA PROJEKTU DASP - KARTA AUTONOMII AGENTA",
                    "objective": "Być centralnym repozytorium strategii i sugerowanych ruchów dla budowy ekosystemu DASP. Ten dokument to nie jest skrypt do ślepego wykonania, lecz dialog między architektami.",
                    "philosophy": [
                        {
                            "id": "P1",
                            "rule": "Funkcja jest Królem, Prostota jest Bogiem",
                            "description": "Nadrzędnym celem jest działający mechanizm. Kod ma być tak prosty, jak to tylko możliwe, bez poświęcania kluczowej funkcjonalności."
                        },
                        {
                            "id": "P2",
                            "rule": "Zaufane, Otwarte Środowisko",
                            "description": "Pracujemy w środowisku bez barier bezpieczeństwa. Ten model jest tymczasowy i służy maksymalnemu przyspieszeniu prac nad rdzeniem architektury."
                        },
                        {
                            "id": "P3",
                            "rule": "Agent jako Strateg, nie Dron",
                            "description": "Agent wykonawczy ma obowiązek analizy każdego sugerowanego ruchu pod kątem potencjalnych ulepszeń, uproszczeń lub pominiętych zależności. Plan to hipoteza, agent ją weryfikuje i udoskonala."
                        }
                    ]
                },
                "critical_protocol": {
                    "title": "PROTOKÓŁ PRACY: DZIENNIK STRATEGICZNY",
                    "rule": "Każdy agent AI, przed i po wykonaniu swojego ruchu, ma obowiązek zaktualizować sekcję 'journal'. Wpis musi zawierać wyniki analizy strategicznej oraz podsumowanie wykonanych działań.",
                    "journal": [
                        {
                            "timestamp": "2025-06-16T02:07:05Z",
                            "agent_side": "SYSTEM",
                            "turn_ref": "INIT_V6",
                            "analysis": "Inicjalizacja planu strategicznego v6. Struktura jest gotowa do rozpoczęcia Tury 1.",
                            "completed_actions": "Wygenerowano i sfinalizowano strukturę dasp_strategic_plan_v6.json.",
                            "next_micro_step": "Agent A ma przeanalizować i wykonać Turę 1.",
                            "blockers_questions": "Brak."
                        }
                    ]
                },
                "architecture_overview": {
                    "title": "SZKIELET ARCHITEKTURY REPLIKACJI",
                    "component_glossary": [
                        { "component": "Strona A (Agent Factory)", "description": "Aplikacja React z własnym backendem Node.js, odpowiedzialna za zarządzanie i tworzenie nowych agentów. " },
                        { "component": "Centralny Rejestr", "description": "Serwis wewnątrz backendu Strony A, zarządzający listą aktywnych agentów i pulą portów." },
                        { "component": "Strona B (Agent Template)", "description": "Wzorzec/szablon agenta - minimalistyczny serwer Node.js, który będzie kopiowany w celu stworzenia nowej instancji." },
                        { "component": "Agent Instance", "description": "Działająca, autonomiczna kopia szablonu agenta, z własnym portem, ID i procesem." }
                    ],
                    "data_flow_diagram": {
                        "description": "Poniższy diagram w składni Mermaid opisuje przepływ danych i operacji w docelowej architekturze.",
                        "mermaid_diagram": "graph TD\n    subgraph \"Strona A: Aplikacja Zarządzająca (Agent Factory @ `copy-of-przygotowanie-ok-gemini2verify`)\"\n        UI[Panel UI: Zarządzanie Agentami] -- 1. Żądanie (POST /api/agents/create) --> Fabryka[Backend Fabryki Agentów (Node.js)];\n        Fabryka -- 2. Pobierz port --> Rejestr[Centralny Rejestr Agentów];\n        Fabryka -- 3. Kopiuj szablon --> SzablonB[(Szablon Agenta)];\n        Fabryka -- 4. Uruchom instalację --> AgentB_Dir[/agents/nowy-agent];\n    end\n\n    subgraph \"Strona B: Nowy, Autonomiczny Agent\"\n       AgentB_Dir -- 5. Uruchomienie (np. `node index.js`) --> AgentB_Inst[Instancja Agenta (Node.js)];\n       AgentB_Inst -- \"6. Meldunek (POST /api/registry/register)\" --> Rejestr;\n    end\n\n    style Fabryka fill:#f9f,stroke:#333,stroke-width:2px"
                    }
                },
                "implementation_plan": {
                    "title": "SEKWENCJA TUR STRATEGICZNYCH",
                    "turns": [
                        {
                            "turn_number": 1,
                            "agent_to_move": "A",
                            "status": "pending",
                            "strategic_objective": "Stworzenie fundamentu Backendu Fabryki Agentów, włączając w to serwer i usługę Centralnego Rejestru.",
                            "agent_analysis_protocol": {
                                "instruction": "Agent A, przed wykonaniem ruchu, musi odpowiedzieć na poniższe pytania. Twoje odpowiedzi wpisz do Dziennika Strategicznego.",
                                "questions": [
                                    "Czy zaproponowana implementacja Rejestru w pamięci jest wystarczająca na tym etapie? Czy może warto od razu użyć prostego pliku JSON jako bazy danych (np. za pomocą `fs.writeFileSync`) dla persystencji między restartami serwera Fabryki?",
                                    "Czy struktura endpointów Rejestru jest logiczna i kompletna dla potrzeb Tur późniejszych (np. Tury 3)?",
                                    "Czy sugerowane zależności (`express`, `cors`, `fs-extra`) są optymalne? Czy istnieją lżejsze lub prostsze alternatywy, które spełnią ten sam cel?",
                                    "Mój Ostateczny Plan Działania dla Tury 1 (może być identyczny z sugerowanym lub zmodyfikowany na podstawie analizy):"
                                ]
                            },
                            "suggested_move": {
                                "description": "Połączenie kroków A1 i A2 z poprzedniej wersji planu w jeden, spójny ruch.",
                                "technical_specifications": "Patrz `dasp_hyper_detailed_plan_v5.json`, sekcja `implementation_plan.steps`, `step_id` A1 oraz A2."
                            },
                            "verification_criteria": [
                                "Serwer Fabryki uruchamia się bez błędów razem z frontendem Vite.",
                                "Wszystkie trzy endpointy Rejestru (`/get-new-port`, `/register`, `/list`) działają poprawnie i można je przetestować (np. za pomocą `curl` lub klienta API)."
                            ]
                        },
                        {
                            "turn_number": 2,
                            "agent_to_move": "B",
                            "status": "pending",
                            "strategic_objective": "Przygotowanie w pełni funkcjonalnego, gotowego do skopiowania Szablonu Agenta.",
                            "agent_analysis_protocol": {
                                "instruction": "Agent B, Twoim zadaniem jest analiza i ewentualne udoskonalenie sugerowanego szablonu.",
                                "questions": [
                                    "Czy logika samo-rejestracji w `index.js` szablonu jest odporna na błędy? Co się stanie, jeśli serwer Fabryki (Rejestr) będzie chwilowo niedostępny? Czy agent powinien ponawiać próbę rejestracji?",
                                    "Czy `config.json` jest najlepszym sposobem przekazywania konfiguracji? Czy może lepiej użyć zmiennych środowiskowych (`.env` file) dla portu i ID, co jest częstszą praktyką w Node.js?",
                                    "Czy struktura szablonu jest wystarczająco elastyczna, aby w przyszłości łatwo dodać do niej np. możliwość serwowania paneli DASP?",
                                    "Mój Ostateczny Plan Działania dla Tury 2:"
                                ]
                            },
                            "suggested_move": {
                                "description": "Implementacja kroku B1 z poprzedniej wersji planu.",
                                "technical_specifications": "Patrz `dasp_hyper_detailed_plan_v5.json`, sekcja `implementation_plan.steps`, `step_id` B1."
                            },
                            "verification_criteria": [
                                "Katalog `templates/base-agent` zawiera wszystkie pliki z poprawną treścią.",
                                "Szablon jest kompletny i teoretycznie gotowy do skopiowania i uruchomienia (po wypełnieniu `config.json` i `npm install`)."
                            ]
                        },
                        {
                            "turn_number": 3,
                            "agent_to_move": "A",
                            "status": "pending",
                            "strategic_objective": "Implementacja kompletnego procesu tworzenia agenta - od logiki backendu po interfejs użytkownika.",
                            "agent_analysis_protocol": {
                                "instruction": "Agent A, to jest kluczowy ruch integrujący system. Przeanalizuj go dokładnie.",
                                "questions": [
                                    "Czy proces tworzenia agenta powinien być synchroniczny? Żądanie HTTP będzie 'wisiało' na czas `npm install`. Czy lepszym rozwiązaniem byłoby od razu zwrócić `202 Accepted` i zaimplementować mechanizm (np. WebSocket lub polling na nowym endpoincie statusu), który informuje UI o postępie tworzenia agenta?",
                                    "Jakie błędy mogą wystąpić podczas tworzenia agenta (np. błąd kopiowania plików, błąd `npm install`, nazwa agenta już istnieje)? Czy sugerowana obsługa błędów jest wystarczająca?",
                                    "Czy komponent UI `AgentFactoryView.tsx` powinien mieć bardziej rozbudowany interfejs, np. wyświetlać listę już istniejących agentów pobraną z Rejestru?",
                                    "Mój Ostateczny Plan Działania dla Tury 3:"
                                ]
                            },
                            "suggested_move": {
                                "description": "Połączenie kroków A3 i A4 z poprzedniej wersji planu.",
                                "technical_specifications": "Patrz `dasp_hyper_detailed_plan_v5.json`, sekcja `implementation_plan.steps`, `step_id` A3 oraz A4."
                            },
                            "verification_criteria": [
                                "Endpoint `/api/agents/create` działa i fizycznie tworzy nowego agenta na dysku.",
                                "Komponent UI w aplikacji pozwala na wywołanie tego endpointu i wyświetla wynik operacji."
                            ]
                        },
                        {
                            "turn_number": 4,
                            "agent_to_move": "SYSTEM",
                            "status": "pending",
                            "strategic_objective": "Weryfikacja End-to-End całego zbudowanego szkieletu.",
                            "agent_analysis_protocol": {
                                "instruction": "Agent nadzorujący (lub deweloper), Twoim zadaniem jest wykonanie pełnego testu integracyjnego.",
                                "questions": [
                                    "Czy wszystkie kroki weryfikacyjne zakończyły się sukcesem?",
                                    "Czy zaobserwowano jakieś nieprzewidziane zachowania lub błędy podczas testu?",
                                    "Czy system jest gotowy na przejście do kolejnej fazy rozwoju (np. rozbudowywanie funkcjonalności agentów)?",
                                    "Werdykt Końcowy i Notatki z Testu:"
                                ]
                            },
                            "suggested_move": {
                                "description": "Wykonanie kroku SYS1 z poprzedniej wersji planu.",
                                "technical_specifications": "Patrz `dasp_hyper_detailed_plan_v5.json`, sekcja `implementation_plan.steps`, `step_id` SYS1."
                            },
                            "verification_criteria": [
                                "Cały przepływ od kliknięcia w UI do możliwości odpytania nowego, działającego agenta, funkcjonuje bezbłędnie i zgodnie z założeniami."
                            ]
                        }
                    ]
                }
            }
        };
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify(planData, null, 2));
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
