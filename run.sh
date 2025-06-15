#!/bin/bash

# Znajdź i zwolnij proces na porcie 3000
echo "Zwalnianie portu 3000..."
fuser -k 3000/tcp || true

# Uruchom aplikację
echo "Uruchamianie serwera i tunelu..."
pnpm start
