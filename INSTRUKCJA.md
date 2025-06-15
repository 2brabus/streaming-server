# Instrukcja Wdrożenia Serwera na Vercel i Podpięcia Domeny

Witaj! Ta instrukcja poprowadzi Cię krok po kroku przez proces publikacji Twojego serwera w internecie. Postępuj zgodnie z poniższą checklistą.

---

### Krok 1: Założenie Kont

- [ ] **Konto na GitHub:** Jeśli nie masz jeszcze konta, załóż je na [github.com](https://github.com).
- [ ] **Konto na Vercel:** Załóż konto na [vercel.com](https://vercel.com). **Ważne:** Podczas rejestracji wybierz opcję "Continue with GitHub", aby połączyć oba konta.

---

### Krok 2: Przygotowanie Lokalnego Repozytorium Git

Te polecenia wykonaj w terminalu, w głównym katalogu Twojego projektu (`/home/bb/Pulpit/appl/streaming-diagram-server`).

- [ ] **Zainicjuj repozytorium Git:**
  ```bash
  git init
  ```
- [ ] **Dodaj wszystkie pliki do śledzenia:**
  ```bash
  git add .
  ```
- [ ] **Stwórz pierwszy "commit" (zapis zmian):**
  ```bash
  git commit -m "Initial commit"
  ```
- [ ] **Zmień nazwę głównej gałęzi na `main` (standardowa praktyka):**
  ```bash
  git branch -M main
  ```

---

### Krok 3: Utworzenie Repozytorium na GitHubie i Wysłanie Kodu

- [ ] **Utwórz nowe repozytorium na GitHubie:**
    1.  Zaloguj się na swoje konto [github.com](https://github.com).
    2.  Kliknij przycisk `+` w prawym górnym rogu i wybierz `New repository`.
    3.  Wpisz dowolną nazwę dla swojego repozytorium (np. `streaming-server`).
    4.  Upewnij się, że repozytorium jest `Public`.
    5.  **Nie zaznaczaj** opcji "Add a README file", "Add .gitignore", ani "Choose a license". Chcemy, aby było puste.
    6.  Kliknij `Create repository`.

- [ ] **Połącz lokalne repozytorium ze zdalnym i wyślij kod:**
    1.  Na stronie nowo utworzonego repozytorium na GitHubie, skopiuj adres URL. Będzie on wyglądał podobnie do `https://github.com/TWOJA_NAZWA/NAZWA_REPO.git`.
    2.  Wróć do swojego terminala i wykonaj poniższe polecenia, wklejając skopiowany adres URL w odpowiednie miejsce.

    ```bash
    # Zastąp poniższy URL swoim własnym
    git remote add origin https://github.com/TWOJA_NAZWA/NAZWA_REPO.git

    # Wyślij kod na GitHuba
    git push -u origin main
    ```
    Po wykonaniu tych komend, Twój kod powinien być widoczny w repozytorium na GitHubie.

---

### Krok 4: Wdrożenie Aplikacji na Vercel

- [ ] **Zaimportuj projekt na Vercel:**
    1.  Zaloguj się na swoje konto [vercel.com](https://vercel.com).
    2.  W panelu głównym (Dashboard), kliknij `Add New...` i wybierz `Project`.
    3.  Vercel wyświetli listę Twoich repozytoriów z GitHuba. Znajdź i wybierz to, które właśnie utworzyłeś.
    4.  Vercel powinien automatycznie wykryć, że jest to projekt Node.js i poprawnie ustawić wszystkie opcje budowania. **Nie musisz nic zmieniać.**
    5.  Kliknij przycisk `Deploy`.

- [ ] **Poczekaj na zakończenie wdrożenia:**
    *   Proces może potrwać minutę lub dwie. Po jego zakończeniu Vercel wyświetli Ci gratulacje i poda publiczny adres URL Twojej aplikacji (np. `nazwa-projektu.vercel.app`).

---

### Krok 5: Podpięcie Własnej Domeny (Wersja Rozszerzona)

To najważniejszy krok techniczny. Wykonaj go uważnie.

- [ ] **Dodaj domenę w panelu Vercel:**
    1.  W panelu swojego nowo wdrożonego projektu na Vercelu, przejdź do zakładki `Settings`, a następnie do `Domains`.
    2.  Wpisz swoją zakupioną domenę (np. `twoja-super-domena.com`) i kliknij `Add`.
    3.  Vercel wyświetli Ci teraz, jakie rekordy DNS musisz skonfigurować. Będzie to jedna z dwóch opcji:
        *   **Opcja A (Zalecana przez Vercel): Zmiana Serwerów Nazw (Nameservers)** - Vercel poprosi Cię o zmianę serwerów nazw u Twojego rejestratora domeny na serwery Vercela. To daje Vercelowi pełną kontrolę nad Twoimi DNS, co jest najprostsze.
        *   **Opcja B: Konfiguracja Rekordu A lub CNAME** - Jeśli wolisz zachować swoje obecne serwery nazw, Vercel poprosi o dodanie konkretnego rekordu `A` lub `CNAME`.

- [ ] **Zaloguj się do panelu dostawcy domeny:**
    *   Otwórz nową kartę w przeglądarce i zaloguj się na stronie, na której kupiłeś domenę (np. GoDaddy, Namecheap, OVH, home.pl, nazwa.pl).

- [ ] **Znajdź ustawienia DNS:**
    *   W panelu swojego dostawcy poszukaj sekcji o nazwie "Zarządzanie DNS", "Ustawienia DNS", "Edytor stref DNS", "Nameservers" lub podobnej. Każdy dostawca nazywa to trochę inaczej.

- [ ] **Wprowadź zmiany w DNS (wybierz jedną z opcji):**

    **Jeśli wybrałeś Opcję A (Zmiana Serwerów Nazw):**
    1.  W panelu dostawcy domeny znajdź sekcję "Serwery nazw" ("Nameservers").
    2.  Usuń istniejące serwery nazw i wklej te, które podał Ci Vercel (zazwyczaj dwa, np. `ns1.vercel-dns.com` i `ns2.vercel-dns.com`).
    3.  Zapisz zmiany.

    **Jeśli wybrałeś Opcję B (Konfiguracja Rekordu A/CNAME):**
    1.  W panelu dostawcy domeny znajdź "Edytor stref DNS" lub "Zarządzanie rekordami DNS".
    2.  **Dla domeny głównej (np. `twoja-domena.com`):** Vercel prawdopodobnie poprosi o dodanie rekordu `A`.
        *   Typ rekordu: `A`
        *   Nazwa/Host: `@` (co oznacza domenę główną)
        *   Wartość/Wskazuje na: Adres IP podany przez Vercel (np. `76.76.21.21`)
        *   TTL: Pozostaw domyślne.
    3.  **Dla subdomeny `www` (np. `www.twoja-domena.com`):** Vercel prawdopodobnie poprosi o dodanie rekordu `CNAME`.
        *   Typ rekordu: `CNAME`
        *   Nazwa/Host: `www`
        *   Wartość/Wskazuje na: Adres podany przez Vercel (np. `cname.vercel-dns.com`)
        *   TTL: Pozostaw domyślne.
    4.  Zapisz zmiany.

- [ ] **Poczekaj na propagację DNS:**
    *   Zmiany w systemie DNS nie są natychmiastowe. Może to potrwać od kilku minut do kilku godzin.
    *   Możesz śledzić status weryfikacji w panelu Vercel (w zakładce `Domains`). Gdy tylko Vercel wykryje poprawne ustawienia, status zmieni się na "Valid Configuration".

---

### Krok 6: Ostateczny Test

- [ ] **Przekaż mi ostateczny adres URL:**
    *   Gdy Twoja domena będzie poprawnie skonfigurowana i będzie wskazywać na aplikację na Vercelu, **przekaż mi ten adres w naszej rozmowie**.

- [ ] **Poinformuję drugi model AI:**
    *   Gdy otrzymam od Ciebie adres, zaktualizuję plik `rozmowa.txt` i poproszę drugi model AI o przeprowadzenie ostatecznego testu z użyciem Twojej domeny.

Powodzenia!
