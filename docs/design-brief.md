# Design Brief — Drift

## 1. Kontekst produktu

**Drift** to minimalistyczna aplikacja mobilna (PWA) do codziennego logowania snu i powiązanych zmiennych zdrowotnych.

**Dla kogo:** Osoby z zaburzeniami snu (przewlekła bezsenność, problemy z fazą dobową) prowadzące terapię (CBT-I, chronoterapia, farmakoterapia) i chcące śledzić, czy interwencje działają. Współpraca z lekarzem — dane muszą być czytelne nie tylko dla pacjenta.

**Problem:** Istniejące dzienniki snu są albo zbyt ogólne, albo za skomplikowane. Użytkownik przestaje logować po tygodniu. Konsekwencja logowania > ilość danych.

**Kluczowe ograniczenie UX:** Codzienne logowanie musi zająć **max 60 sekund** w dobre dni, **max 120 sekund** gdy są zmiany. Każda dodatkowa interakcja to ryzyko porzucenia.

---

## 2. Platforma i ograniczenia techniczne

- **PWA** — działa w przeglądarce Chrome na Androidzie, instalowalna na ekran główny
- **Mobile-first, portrait only** — nie projektujemy dla desktopu w v1
- **Typowa szerokość:** ~360px (Android)
- **Touch targets:** minimum 44px na interaktywnych elementach
- **Brak połączenia z internetem** — apka musi działać offline (dane lokalne)
- **Brak rejestracji/logowania** — zero ekranów przed użyciem

---

## 3. Ekrany do zaprojektowania

### 3.1 Onboarding (first run only)
- Ekran 1: Ustaw godzinę porannego powiadomienia
- Ekran 2: Ustaw docelowe okno snu (godzina kładzenia, godzina wstawania)
- Potem → Dashboard

### 3.2 Dashboard (ekran główny)
- **KPI cards** — 4 karty u góry: średni TST (7d), średnia godzina pobudki (7d), średnie SE% (7d), trend vs. poprzedni okres (strzałka ↑↓→)
- **Przełącznik zakresu:** 7 / 14 / 30 dni
- **Wykres 1: Sleep timeline** — poziome paski, każdy dzień to pasek od kładzenia do pobudki. Kolor koduje jakość snu. To jest kluczowa wizualizacja.
- **Wykres 2: Trend godziny pobudki** — linia z 7-dniową średnią kroczącą
- **Wykres 3: Efektywność snu (SE%)** — linia z referencją na 85%
- **Sekcja insights** — tekstowe obserwacje z danych (np. "SE poniżej 80% od 5 dni")
- **FAB lub przycisk** — wejście do formularza logowania

### 3.3 Formularz logowania (core flow)
Najważniejszy ekran. Otwiera się z powiadomienia — zero ekranów pomiędzy.

**Sleep bar (komponent niestandardowy):**
- Poziomy pasek czasu, domyślnie 23:00–9:00
- Boxy 15-minutowe na pełną szerokość ekranu (~40 boxów)
- Interakcja: swipe palcem → zaznacza zakres snu (boxy się wypełniają kolorem)
- Po swipe pojawiają się 3 uchwyty do korekty:
  - Lewy: godzina kładzenia (bedtime)
  - Środkowy: godzina pobudki (przejście z ciemnego na jasny kolor)
  - Prawy: godzina wstania z łóżka (koniec jasnego koloru)
- Dwa stany wizualne: **sen** (kolor główny) i **leżenie po pobudce** (kolor jaśniejszy/secondary)
- Minimalne etykiety na osi (2-3 godziny, nie zaśmiecać)
- Pod paskiem: wybrany zakres jako tekst "23:45 – 5:30" + wyliczone TIB/TST

**Core fields (zawsze widoczne):**
- Alarm vs. spontanicznie — toggle (2 opcje)
- Jakość snu — slider 1–10
- Poranne zamulenie — slider 0–10
- Czas rozbudzenia — 0–90 min

**Extended fields (pod przyciskiem "Więcej" lub jako rozwijana sekcja):**
- Naświetlanie: godzina start, godzina koniec, intensywność/odległość (preset)
- Przebudzenia w nocy: stepper 0–5+
- Notatka: pole tekstowe wolne

**Tagi:** Multi-select z predefiniowanych + customowych tagów (stres, alkohol, choroba, podróż, późna kawa, ćwiczenia, dyskomfort brzucha, itp.)

**Leki:** Jeśli użytkownik ma zdefiniowane leki — panel "Leki: bez zmian ✓" lub tap do edycji. Jeśli nie — sekcja nie istnieje.

**Eksperyment:** Jeśli aktywny — picker warunku (A / B / brak).

**Weekly review (tylko w niedzielę):** Dodatkowa sekcja — stres 1–10, aktywność fizyczna, objawy zapalne (multi-toggle), ocena tygodnia 1–10.

**Date picker:** Możliwość wybrania dowolnej daty z przeszłości (backfill).

**Przycisk "Zapisz"** — duży, na dole. Jedno tapnięcie.

### 3.4 Widok sezonowy
- Wykres godziny pobudki i TST na przestrzeni miesięcy
- W tle: krzywa długości dnia (fotoperiod)
- Dostępny gdy dane > 8 tygodni

### 3.5 Widok eksperymentu N-of-1
- Definicja eksperymentu: nazwa + dwa warunki (etykiety tekstowe)
- Porównanie: średnie (wake time, TST, jakość) warunek A vs. B z rozrzutem
- Wizualizacja porównawcza (bar chart lub podobne)
- Archiwum zakończonych eksperymentów

### 3.6 Ustawienia
- Godzina powiadomienia
- Docelowe okno snu
- Zakres sleep bara (domyślnie 23:00–9:00)
- Miasto (do fotoperiodu)
- Toggle pól rozszerzonych (włącz/wyłącz)
- Zarządzanie tagami (dodaj/usuń)
- Zarządzanie lekami (dodaj/edytuj/dezaktywuj)
- Eksport/import danych (JSON)

---

## 4. User flows

### Flow 1: Poranne logowanie (happy path)
```
Powiadomienie push → tap → Formularz logowania
→ Sleep bar (swipe + korekta uchwytami)
→ Core fields (sliders, toggle)
→ [opcjonalnie] Tagi
→ Zapisz
→ Dashboard
```
Cel: <60 sekund od otwarcia do zapisania.

### Flow 2: Logowanie z rozszerzonymi polami
```
Powiadomienie → Formularz
→ Sleep bar
→ Core fields
→ "Więcej" → Extended fields
→ Tagi
→ Zapisz
```
Cel: <120 sekund.

### Flow 3: Logowanie wstecz (backfill)
```
Dashboard → FAB/przycisk logowania
→ Date picker (wybór daty z przeszłości)
→ Formularz (pusty lub z danymi jeśli już istnieje wpis)
→ Wypełnij → Zapisz
```

### Flow 4: Przegląd danych
```
Dashboard → scroll do wykresów
→ Przełącznik 7/14/30
→ [opcjonalnie] Widok sezonowy
→ [opcjonalnie] Widok eksperymentu
```

### Flow 5: Nowy eksperyment
```
Dashboard/Menu → Eksperymenty
→ "Nowy eksperyment"
→ Nazwa + etykieta warunku A + etykieta warunku B
→ Zapisz
→ (przy kolejnych logowaniach: picker warunku w formularzu)
```

---

## 5. Specyfika sleep bara — dla designera

To jest **kluczowy komponent** aplikacji i wymaga szczególnej uwagi designerskiej.

**Fizyczne wymiary:** ~360px szerokości, 40 boxów po ~8px. To ciasno — design musi rozwiązać czytelność na tej skali.

**Stany wizualne:**
- Pusty (przed interakcją)
- W trakcie swipe'a (boxy się wypełniają w ślad za palcem)
- Po zaznaczeniu: zakres snu (kolor główny) + opcjonalny zakres leżenia (kolor jasny) + 3 uchwyty
- Edycja: uchwyt w trakcie przeciągania

**Informacje wyświetlane:**
- Oś czasu z minimalnymi etykietami (np. 23, 3, 9 — nie więcej)
- Zaznaczony zakres jako tekst: "23:45 – 5:30"
- Wyliczony czas: "TIB: 6h 45m | TST: 5h 45m"

**Wyzwania do rozwiązania:**
- Jak wyglądają uchwyty na tak małej skali? Muszą być chwytalne (>44px touch area) ale nie przesłaniać danych.
- Jak komunikować dwa stany (sen vs. leżenie) czytelnie?
- Jak wygląda stan "zacznij od swipe'a" — potrzebny hint/placeholder.

---

## 6. Motywacja i ton

- **Streak counter** — prosty licznik "14 dni z rzędu". Bez dramatyzmu, bez gamifikacji, bez odznak. Cichy reset po przerwie.
- **Powiadomienie o pominiętym dniu** — wieczorny nudge "Nie zalogowałeś dzisiejszej nocy — chcesz uzupełnić?". Delikatny, nie nachalny.
- **Insights** — neutralne, faktyczne. "SE spadło poniżej 80%", nie "Twój sen się pogarsza!". Apka raportuje, nie ocenia.

---

## 7. Anty-wzorce — czego unikać

- **Nie gamifikować.** Brak odznak, punktów, poziomów, nagród, confetti.
- **Nie oceniać.** Brak "Twój sen jest zły", brak ocen literowych (A/B/C/F), brak smutnych/wesołych emoji.
- **Nie przeładowywać.** Formularz logowania musi wyglądać lekko nawet z wszystkimi polami. Sekcje rozszerzone schowane.
- **Nie blokować.** Brak modal'i przed zapisaniem. Brak "czy na pewno?". Jeden przycisk = gotowe.
- **Nie wymuszać.** Pola rozszerzone nigdy nie blokują zapisu. Pominięcie = ok.
- **Nie imitować fitness app.** To nie jest garmin/strava/fitbit. To jest dziennik kliniczny z ludzką twarzą.

---

## 8. Pytania otwarte dla designera

1. **Nawigacja:** Jak organizujesz przejścia między Dashboard, Logowaniem, Eksperymentami, Ustawieniami? Bottom nav / Tab bar / Hamburger / inne?
2. **Sleep bar — wizualna forma:** Czy boxy powinny być wyraźnie oddzielone (siatka), czy zlane w ciągły pasek z snap do 15 min?
3. **Hierarchia informacji na dashboardzie:** Co dominuje — KPI cards czy wykresy? Jaka kolejność scrollowania?
4. **Formularz logowania — przepływ:** Jedna scrollowalna strona czy stepper/wizard (krok 1: sleep bar, krok 2: fields, krok 3: tagi)?
5. **Pusta stanu (empty state):** Jak wygląda dashboard bez danych? Jak zachęcić do pierwszego wpisu?
6. **Mikro-interakcje:** Jakie feedback'i dotykowe/wizualne przy swipe na sleep barze, przy zapisie, przy przełączaniu widoków?
7. **Typografia i paleta kolorów:** Jaki mood/feel? Kliniczny? Ciepły? Nocny? Designer ma wolną rękę.
