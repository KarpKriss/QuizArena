# 02 — Architecture

## Status

Architecture baseline v0.1.

## Frontend

- React
- TypeScript
- Vite
- CSS bez obowiązkowego frameworka UI na etapie fundamentu

## Dlaczego taki stack

Projekt na początku nie potrzebuje server-side rendering, rozbudowanego backendu ani ciężkiej warstwy aplikacyjnej. Vite + React daje szybki development, prosty deployment i pozostawia możliwość późniejszego wydzielenia bardziej zaawansowanych funkcji.

## Zasada architektoniczna

Warstwa prezentacji nie może być źródłem prawdy dla reguł i danych domenowych.

Docelowo, gdy pojawi się logika companion app, kod powinien być organizowany mniej więcej tak:

```text
src/
├─ app/             # bootstrap aplikacji, routing, global composition
├─ components/      # współdzielone elementy UI
├─ features/        # funkcje użytkowe grupowane domenowo
├─ domain/          # modele i czysta logika Quiz Arena
├─ data/            # adaptery i źródła danych
├─ pages/           # widoki / ekrany
├─ styles/          # design tokens i style globalne
└─ assets/          # assety wykorzystywane przez bundler
```

Nie należy tworzyć całej tej struktury z pustymi folderami. Folder powstaje dopiero, gdy jest potrzebny przez realny kod.

## Granice odpowiedzialności

### UI
Odpowiada za renderowanie, interakcje i dostępność.

### Domain
Odpowiada za modele i zasady niezależne od Reacta.

### Data
Odpowiada za sposób pozyskania danych. Dzięki temu późniejsza zmiana z lokalnego JSON na API nie powinna wymagać przebudowy komponentów UI.

## Dane prywatne

Pełna baza pytań nie jest częścią publicznego bundle aplikacji marketingowej.

Jeżeli companion app będzie wymagał dostępu do chronionej treści, należy osobno zaprojektować:

- model backendu,
- autoryzację dostępu,
- sposób dostarczania danych,
- ochronę przed przypadkowym wyciekiem całego datasetu do klienta.

## Routing

Nie dodajemy routera, dopóki aplikacja realnie nie ma więcej niż jednego widoku wymagającego routingu. Landing page może działać bez dodatkowej zależności.

## State management

Na starcie używamy lokalnego stanu React. Globalny store jest dopuszczalny dopiero wtedy, gdy istnieje konkretny problem, którego Context/composition nie rozwiązują w czytelny sposób.

## Backend

Brak backendu w Phase 0 i domyślnie w Product Website MVP.

Backend jest decyzją funkcjonalną, nie domyślnym elementem stacku.

## Hosting

Nie wybrano jeszcze docelowego hostingu. Aplikacja powinna pozostać kompatybilna ze statycznym hostingiem do czasu pojawienia się funkcji wymagających serwera.

## Jakość

Minimalny quality gate przed merge większej funkcji:

- TypeScript bez błędów,
- poprawny production build,
- brak sekretów w repo,
- poprawna obsługa mobile,
- semantyczny HTML i podstawowa dostępność,
- aktualizacja dokumentacji, jeśli zmienia się decyzja architektoniczna.
