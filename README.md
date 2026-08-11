# Quiz Arena

Repozytorium aplikacji webowej rozwijanej wokół gry **Quiz Arena**.

## Cel projektu

Zbudować nowoczesną, responsywną stronę/aplikację wspierającą markę i rozgrywkę Quiz Arena, z architekturą pozwalającą stopniowo przejść od prostej strony prezentacyjnej do pełnego cyfrowego companion app.

## Status

**Phase 0 — Foundation**

Repozytorium zostało zainicjalizowane. Na tym etapie porządkujemy zakres produktu, architekturę i standardy implementacyjne, zanim zacznie powstawać właściwy interfejs.

## Założenia techniczne

- React
- TypeScript
- Vite
- responsywny interfejs desktop/mobile
- kod podzielony na małe, testowalne moduły
- dane domenowe oddzielone od warstwy UI
- brak sekretów, tokenów i prywatnej bazy pytań w repozytorium

## Struktura

```text
QuizArena/
├─ docs/                 # dokumentacja produktu i architektury
├─ src/                  # kod aplikacji
├─ public/               # statyczne assety publiczne
├─ AGENTS.md             # instrukcje dla Codex / agentów AI
├─ README.md
└─ package.json
```

## Dokumentacja

Najważniejsze dokumenty projektu będą utrzymywane w `docs/`.

1. `00_PROJECT_CHARTER.md` — po co istnieje aplikacja i jakie ma granice
2. `01_PRODUCT_SCOPE.md` — zakres MVP i dalszego rozwoju
3. `02_ARCHITECTURE.md` — decyzje techniczne i struktura aplikacji
4. `03_ROADMAP.md` — kolejność prac

## Bezpieczeństwo i IP

Repozytorium nie powinno przechowywać pełnej bazy pytań, odpowiedzi ani innych treści gry, które mają pozostać niepubliczne. Dane takie powinny być później utrzymywane w prywatnym źródle danych lub backendzie.

---

Quiz Arena — web project.
