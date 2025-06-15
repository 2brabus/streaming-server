# Kompendium Wiedzy: Wdrażanie i Testowanie Serwera Streamującego

Ten dokument stanowi kompletny przewodnik techniczny, opisujący architekturę, konfigurację, wdrożenie i testowanie serwera Node.js, który udostępnia strumieniowane dane (streaming API) oraz pliki statyczne. Dokument ten jest wynikiem procesu rozwiązywania problemów z komunikacją cross-origin (CORS) między serwerem a zdalną aplikacją kliencką.

## 1. Wprowadzenie i Architektura Rozwiązania

### 1.1. Problem

Początkowym wyzwaniem było umożliwienie bezpiecznej i niezawodnej komunikacji między zdalną aplikacją kliencką (działającą np. w Google AI Studio) a lokalnie tworzonym serwerem. Główne problemy do rozwiązania to:
- **Dostępność:** Jak udostępnić lokalny serwer aplikacji klienckiej działającej w chmurze.
- **CORS (Cross-Origin Resource Sharing):** Jak skonfigurować serwer, aby przeglądarki nie blokowały żądań przychodzących z innej domeny.

### 1.2. Rozwiązanie

Zastosowano nowoczesne, standardowe i niezawodne rozwiązanie oparte na trzech filarach:

1.  **Serwer Node.js:** Lekki serwer napisany w TypeScript, używający natywnego modułu `http` do maksymalnej kontroli nad żądaniami i odpowiedziami.
2.  **GitHub:** System kontroli wersji, służący jako centralne repozytorium kodu.
3.  **Vercel:** Platforma hostingowa, która integruje się z GitHubem, automatycznie buduje i wdraża aplikację po każdej zmianie w kodzie (CI/CD), a także zapewnia globalną sieć (CDN) i łatwą konfigurację domen.

### 1.3. Diagram Architektury

```mermaid
graph TD
    subgraph "Użytkownik / Deweloper"
        A[Lokalny komputer] -- git push --> B[Repozytorium GitHub];
    end

    subgraph "Automatyzacja (CI/CD)"
        B -- Webhook --> C{Vercel};
        C -- Buduje i wdraża --> D[Aplikacja na Vercel];
    end

    subgraph "Infrastruktura Produkcyjna"
        E[Domena (np. autoprogres.pl)] -- DNS --> D;
        F[Aplikacja Kliencka (np. Google AI Studio)] -- HTTPS Request --> E;
        D -- HTTPS Response --> F;
    end

    style C fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:2px
```

---

## 2. Konfiguracja Serwera (Backend)

Sercem aplikacji jest plik `api/server.ts`, który definiuje, jak serwer ma się zachowywać.

### 2.1. Pełny Kod `api/server.ts`

```typescript
import * as http from 'http';

const server = http.createServer((req, res) => {
  // Ręczna, jawna obsługa żądania OPTIONS (preflight) dla CORS
  if (req.method === 'OPTIONS' && req.url === '/api/echo-stream') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Obsługa endpointu POST do streamowania
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

  // Domyślna odpowiedź 404 dla innych tras API
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404: API Route Not Found', 'utf-8');
});

export default server;
```

### 2.2. Kluczowe Aspekty Kodu

- **Natywny Moduł `http`:** Zamiast frameworka Express.js, używamy podstawowego modułu `http` z Node.js. Daje to pełną kontrolę, ale wymaga ręcznej obsługi routingu i nagłówków.
- **Obsługa CORS:** To najważniejsza część. Gdy przeglądarka chce wysłać "skomplikowane" żądanie (np. `POST` z `Content-Type: application/json` na inną domenę), najpierw wysyła "zapytanie wstępne" (preflight request) metodą `OPTIONS`. Nasz serwer musi na nie poprawnie odpowiedzieć:
    - `if (req.method === 'OPTIONS' ...)`: Wykrywamy to zapytanie.
    - `res.writeHead(204, ...)`: Wysyłamy odpowiedź ze statusem `204 No Content` i kluczowymi nagłówkami:
        - `Access-Control-Allow-Origin: *`: Zezwala na żądania z **każdej** domeny.
        - `Access-Control-Allow-Methods: 'POST, OPTIONS'`: Informuje przeglądarkę, że akceptujemy te metody.
        - `Access-Control-Allow-Headers: 'Content-Type'`: Zezwala na wysyłanie nagłówka `Content-Type`.
- **Endpoint Streamujący:**
    - `if (req.method === 'POST' ...)`: Wykrywamy właściwe żądanie `POST`.
    - `res.write()`: Zamiast wysyłać całą odpowiedź naraz za pomocą `res.end()`, wysyłamy ją w kawałkach w regularnych odstępach czasu, symulując strumień danych.
- **Eksport Serwera:**
    - `export default server;`: Zamiast `server.listen()`, eksportujemy instancję serwera. To standard wymagany przez środowiska serwerless, takie jak Vercel, które same zarządzają cyklem życia serwera.

### 2.3. Jak Dodać Nowy Endpoint (np. do streamowania pliku JSON)

Aby dodać nowy endpoint, np. `/api/stream-json`, należy dodać kolejny blok `if` w `api/server.ts`:

```typescript
// ... (po obsłudze OPTIONS)

// Nowy endpoint do streamowania pliku JSON
if (req.method === 'GET' && req.url === '/api/stream-json') {
  const filePath = path.join(__dirname, '../public/sample-diagram.json'); // Ścieżka do pliku
  const stream = fs.createReadStream(filePath);

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });

  stream.pipe(res); // Przesyłamy strumień pliku bezpośrednio do odpowiedzi
  return;
}

// ... (po obsłudze POST)
```
**Uwaga:** Należy również dodać `import * as fs from 'fs';` i `import * as path from 'path';` na początku pliku.

---

## 3. Konfiguracja Projektu i Wdrożenia

Te pliki konfiguracyjne mówią narzędziom (TypeScript, Vercel), jak mają traktować nasz kod.

### 3.1. `package.json` (Zależności i Skrypty)

```json
{
  "name": "streaming-diagram-server",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "pnpm run build && node dist/api/server.js"
  },
  "dependencies": {
    "@types/node": "^24.0.1"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
```
- **`scripts`**:
    - `build`: Używa kompilatora TypeScript (`tsc`) do przekształcenia kodu z `.ts` na `.js`.
    - `start`: Najpierw buduje projekt, a potem uruchamia skompilowany plik serwera. Ten skrypt jest używany przez Vercel.

### 3.2. `tsconfig.json` (Konfiguracja TypeScript)

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["api/**/*.ts"]
}
```
- **`module": "commonjs"`**: Kompiluje kod do formatu CommonJS, standardowego dla Node.js.
- **`outDir": "./dist"`**: Umieszcza skompilowane pliki `.js` w katalogu `dist`.
- **`include": ["api/**/*.ts"]`**: Mówi kompilatorowi, aby przetworzył wszystkie pliki `.ts` wewnątrz katalogu `api`.

### 3.3. `vercel.json` (Konfiguracja Vercela)

```json
{
  "version": 2,
  "public": true,
  "builds": [
    {
      "src": "api/server.ts",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/server.ts" }
  ]
}
```
- **`"public": true`**: Mówi Vercelowi, aby automatycznie serwował zawartość katalogu `public` jako pliki statyczne.
- **`builds`**: Definiuje, jak Vercel ma budować projekt. W tym przypadku, plik `api/server.ts` jest traktowany jako funkcja serwerless Node.js.
- **`rewrites`**: To kluczowa reguła routingu. Mówi Vercelowi: "Jeśli przyjdzie żądanie na ścieżkę pasującą do `/api/(.*)` (np. `/api/echo-stream`), przekaż je do funkcji zdefiniowanej w `api/server.ts`". Wszystkie inne żądania (np. `/index.html`) zostaną obsłużone przez serwowanie plików z katalogu `public`.

---

## 4. Rola GitHuba (CI/CD)

GitHub w tym projekcie pełni rolę więcej niż tylko repozytorium kodu. Jest on sercem procesu **CI/CD (Continuous Integration / Continuous Deployment)**.

- **Przepływ Pracy:**
    1.  Deweloper wprowadza zmiany w kodzie na swoim lokalnym komputerze.
    2.  Używa polecenia `git push`, aby wysłać te zmiany na GitHuba.
    3.  GitHub automatycznie powiadamia Vercela o nowej zmianie (za pomocą mechanizmu zwanego "webhook").
    4.  Vercel pobiera najnowszą wersję kodu, buduje ją zgodnie z konfiguracją (`vercel.json`, `package.json`) i wdraża jako nową, produkcyjną wersję aplikacji.

Dzięki temu proces wdrażania jest w pełni zautomatyzowany, szybki i powtarzalny.

---

## 5. Instrukcja Wdrożenia od Zera

*Ta sekcja jest skróconą wersją pliku `INSTRUKCJA.md`.*

1.  **Załóż konta:** Utwórz darmowe konta na [GitHub](https://github.com) i [Vercel](https://vercel.com), łącząc je ze sobą.
2.  **Przygotuj Git:** W terminalu projektu wykonaj `git init`, `git add .`, `git commit`.
3.  **Utwórz repozytorium na GitHubie:** Stwórz nowe, puste repozytorium publiczne.
4.  **Wyślij kod:** Połącz lokalne repozytorium ze zdalnym (`git remote add ...`) i wyślij kod (`git push`).
5.  **Wdróż na Vercel:** W panelu Vercela zaimportuj projekt z GitHuba. Vercel automatycznie go wdroży.
6.  **Podepnij domenę:** W ustawieniach projektu na Vercelu dodaj swoją domenę i postępuj zgodnie z instrukcjami, aby skonfigurować rekordy DNS u swojego dostawcy domeny.

---

## 6. Testowanie i Weryfikacja

Po wdrożeniu, kluczowe jest sprawdzenie, czy wszystko działa.

- **Testowanie Plików Statycznych:**
    - Otwórz w przeglądarce adres pliku z katalogu `public`, np. `https://twoja-domena.com/index.html`. Powinieneś zobaczyć zawartość pliku.

- **Testowanie Endpointu API:**
    - Endpoint API reagujący na `POST` nie może być testowany przez proste wpisanie adresu w przeglądarce (która wysyła `GET`).
    - Użyj narzędzia `curl` w terminalu:
      ```bash
      # Zastąp URL i dane swoimi własnymi
      curl -L -X POST -H "Content-Type: text/plain" -d "Wiadomość testowa" https://twoja-domena.com/api/echo-stream
      ```
    - Flaga `-L` jest ważna, aby `curl` automatycznie podążał za ewentualnymi przekierowaniami (np. z `domena.com` na `www.domena.com`).
    - Oczekiwany wynik to odpowiedź serwera wypisana w terminalu.

---

## 7. Komunikacja Frontend <-> Backend

Aby aplikacja kliencka mogła poprawnie komunikować się z tym serwerem, musi spełniać następujące warunki:
- Wysyłać żądania na poprawny, publiczny adres URL (np. `https://www.twoja-domena.com/api/echo-stream`).
- Używać poprawnej metody HTTP (`POST`).
- Wysyłać poprawny nagłówek `Content-Type` (`text/plain`).
- Być przygotowana na obsługę strumieniowanej odpowiedzi.
