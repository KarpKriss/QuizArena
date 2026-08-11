# AGENTS.md — Quiz Arena

Ten plik definiuje zasady pracy dla Codex i innych agentów AI rozwijających repozytorium.

## 1. Cel

Rozwijaj aplikację webową Quiz Arena iteracyjnie, bez zgadywania niezatwierdzonych reguł biznesowych i bez wprowadzania niepotrzebnej złożoności.

## 2. Źródła prawdy

Przed większą zmianą przeczytaj:

1. `README.md`
2. `docs/00_PROJECT_CHARTER.md`
3. `docs/01_PRODUCT_SCOPE.md`
4. `docs/02_ARCHITECTURE.md`
5. `docs/03_ROADMAP.md`

Jeżeli kod i dokumentacja są sprzeczne, nie zakładaj automatycznie, że kod jest poprawny. Zgłoś rozbieżność albo zaktualizuj dokumentację wraz ze zmianą, jeśli zadanie wyraźnie ją rozstrzyga.

## 3. Zasady implementacji

- TypeScript w trybie strict.
- React functional components.
- Preferuj małe komponenty i czyste funkcje.
- Nie dodawaj biblioteki tylko po to, żeby uniknąć kilku linii kodu.
- Nie dodawaj backendu, auth, bazy danych ani state-management frameworka bez wymagania produktowego.
- Zachowuj pełną responsywność od 320 px wzwyż.
- Dbaj o dostępność: semantyczny HTML, focus states, kontrast, obsługa klawiatury.
- Unikaj magic numbers i zaszywania reguł gry bezpośrednio w komponentach UI.
- Dane domenowe i logika gry mają być oddzielone od prezentacji.

## 4. Ochrona treści gry

Nie commituj do repozytorium:

- pełnej bazy pytań i odpowiedzi,
- kluczy API,
- sekretów,
- danych osobowych,
- prywatnych materiałów produkcyjnych,
- danych testowych opartych na poufnych materiałach.

Do przykładów używaj fikcyjnych danych demonstracyjnych.

## 5. Design

Nie twórz generycznego wyglądu SaaS. Quiz Arena jest fizyczną grą imprezową i warstwa webowa powinna docelowo czerpać z jej własnej identyfikacji wizualnej.

Do czasu zatwierdzenia design systemu:

- traktuj obecne style jako placeholder,
- nie buduj rozbudowanej biblioteki komponentów,
- nie przywiązuj architektury do jednego konkretnego motywu graficznego.

## 6. Workflow

Dla większej funkcji:

1. zidentyfikuj wymaganie i zakres,
2. sprawdź wpływ na istniejącą architekturę,
3. zaimplementuj najmniejszą spójną zmianę,
4. uruchom typecheck/build,
5. sprawdź responsywność i podstawową dostępność,
6. zaktualizuj dokumentację, jeżeli zmieniły się decyzje projektowe.

## 7. Definition of Done

Zmiana jest zakończona, gdy:

- realizuje zadany zakres,
- nie wprowadza błędów TypeScript,
- build przechodzi,
- nie powoduje oczywistej regresji mobile/desktop,
- nie ujawnia chronionych danych,
- nie pozostawia nieudokumentowanej decyzji architektonicznej.
