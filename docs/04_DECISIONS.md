# 04 — Decision Log

Ten dokument zapisuje ważniejsze decyzje projektowe i architektoniczne. Nie jest changelogiem kodu.

| ID | Decyzja | Status | Uzasadnienie |
|---|---|---|---|
| DEC-001 | Quiz Arena Web rozwijamy w osobnym repozytorium `QuizArena`. | ACCEPTED | Oddziela produkt webowy od materiałów produkcyjnych fizycznej gry i pozwala prowadzić własny lifecycle aplikacji. |
| DEC-002 | Fundament frontendu: React + TypeScript + Vite. | ACCEPTED | Wystarcza do szybkiego, responsywnego produktu webowego bez narzucania backendu lub ciężkiego frameworka. |
| DEC-003 | W Phase 0 nie wdrażamy backendu. | ACCEPTED | Na tym etapie nie istnieje funkcja wymagająca serwera. Backend ma wynikać z potrzeby produktowej. |
| DEC-004 | Pełna baza pytań i odpowiedzi nie trafia do publicznego repo ani publicznego bundle. | ACCEPTED | Chroni treść gry i ogranicza ryzyko łatwego wyciągnięcia całej bazy z aplikacji. |
| DEC-005 | Marketing website, Rules Hub i Companion App traktujemy jako osobne warstwy produktu. | ACCEPTED | Zapobiega budowie jednej monolitycznej aplikacji bez jasnego celu użytkownika. |
| DEC-006 | Obecny landing i styling są placeholderem, nie zatwierdzonym designem. | ACCEPTED | Docelowy web design powinien wynikać z identyfikacji Quiz Arena oraz realnych assetów gry. |
| DEC-007 | Repozytorium jest obecnie publiczne; przed dodaniem chronionych materiałów należy świadomie rozstrzygnąć jego widoczność. | OPEN | Kod strony może być publiczny, ale materiały gry i baza pytań wymagają osobnej decyzji dotyczącej IP. |

## Jak dodawać decyzje

Nowa decyzja powinna zawierać:

- kolejny identyfikator `DEC-XXX`,
- jednoznaczne zdanie opisujące decyzję,
- status: `PROPOSED`, `ACCEPTED`, `SUPERSEDED` albo `OPEN`,
- krótkie uzasadnienie.

Jeżeli decyzja zostaje zmieniona, nie usuwaj starej pozycji. Oznacz ją jako `SUPERSEDED` i dodaj nową decyzję.
