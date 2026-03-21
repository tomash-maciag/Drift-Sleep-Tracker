# Dashboard — Content & Structure Spec v2

Ekran główny aplikacji Drift. Użytkownik otwiera go codziennie rano po zalogowaniu snu i w ciągu dnia żeby sprawdzić trendy. Urządzenie: telefon Android, ~360px, portrait.

---

## Elementy stałe (fixed)

### Top App Bar
- Po lewej: ikona aplikacji + tekst "DRIFT"
- Nic po prawej (minimalistyczny)
- Przyklejony na górze, zawsze widoczny

### FAB (przycisk akcji)
- Ikona "+" — otwiera formularz logowania snu
- Pozycja: prawy dolny róg, nad nawigacją

### Bottom Navigation
- 3 taby: Home (aktywny), Experiments, Settings
- Każdy tab: ikona + label
- Przypięta na dole ekranu

---

## Treść scrollowalna (od góry do dołu)

### 1. Powitanie
- Linia 1: dzisiejsza data, np. "FRIDAY, MAR 21"
- Linia 2: powitanie kontekstowe — "Good morning" (przed 12:00), "Good afternoon" (12:00–18:00), "Good evening" (po 18:00)

### 2. Dzisiejszy status

**Gdy użytkownik zalogował dzisiejszy sen:**
- Label: "Last Night"
- Trzy wartości obok siebie, oddzielone separatorem:
  - Czas snu + label "sleep", np. "7h 20m sleep"
  - Godzina pobudki + label "wake", np. "06:30 wake"
  - Efektywność w procentach, np. "92%"

**Gdy użytkownik NIE zalogował dzisiejszego snu:**
- Tekst zachęcający: "Log today's sleep"
- Pod spodem: "Tap to record last night"
- Przycisk "+" po prawej

### 3. Sleep Pattern

Zawsze pokazuje ostatnie 7 dni (nie reaguje na toggle).

**Nagłówek:**
- Po lewej: tytuł "Sleep Pattern" + sub-label "Sleep window" z mini legendą linii przerywanej
- Po prawej: "7 Days" + legenda dwóch kolorów: "In bed" i "Sleep"

**Wykres:**
- Jeden poziomy pasek na każdy dzień (7 pasków)
- Każdy pasek ma dwa stany: "in bed" (cały zakres od kładzenia do wstania) i "sleep" (od zaśnięcia do pobudki) — nakładające się
- Dwie pionowe linie przerywane oznaczające pożądane okno snu (np. 00:00 i 07:00)
- Oś czasu na dole: 22:00, 00:00, 03:00, 07:00, 10:00
- Przy każdym pasku: dzień tygodnia po lewej (MON, TUE...), czas snu po prawej (np. "6h 45m")
- Jakość snu wpływa na widoczność paska (gorsza noc = bardziej przytłumiony)

**Mock data:**
- SAT — kładzenie 23:00, pobudka 06:15, jakość 8
- SUN — kładzenie 23:00, pobudka 06:30, jakość 8
- MON — kładzenie 23:15, pobudka 04:30, jakość 4
- TUE — kładzenie 23:00, pobudka 05:00, jakość 5
- WED — kładzenie 23:30, pobudka 05:15, jakość 5
- THU — kładzenie 23:00, pobudka 05:30, jakość 6
- FRI — kładzenie 23:15, pobudka 05:45, jakość 6

### 4. Insights

Automatycznie generowane obserwacje tekstowe. Neutralne, faktyczne — nigdy oceniające.

- Label: "Insights"
- Max 3 wpisy
- Każdy wpis ma typ:
  - Warning (⚠) — coś do zwrócenia uwagi
  - Info (→) — neutralna obserwacja
- Wyróżnienie wizualne: element odróżniający tę sekcję od zwykłych kart (np. akcent na lewej krawędzi)

**Przykładowe treści:**
- ⚠ "SE below 80% for 5 consecutive days."
- → "Wake time shifted 25 min later vs. previous week — positive trend."
- → "Average sleep quality improved from 5.3 to 7.4 over last 7 days."

### 5. Trends — nagłówek + KPI + toggle

Sekcja analityczna. Toggle kontroluje KPI, Wake Trend i Efficiency poniżej.

**Nagłówek:**
- Po lewej: sub-label "OVERVIEW" + tytuł "Trends"
- Po prawej: toggle z trzema opcjami — "7d" / "14d" / "30d"

**Cztery karty KPI w siatce 2×2:**

- **Sleep Time** — średni czas snu za wybrany okres, np. "6h 40m"
- **Efficiency** — średnia efektywność snu, np. "88" + "%"
- **Wake Up** — średnia godzina pobudki, np. "05:50"
- **Trend** — ikona kierunku + tekst: "↑ Improving" / "↓ Declining" / "→ Stable"

Każda karta: label na górze, wartość na dole.
Wartości zaokrąglone do 5 minut.
Label zmienia się z togglem: np. "Sleep Time" (bez sufixu — okres wynika z toggle).

### 6. Wake Trend

Wykres pokazujący jak zmienia się godzina pobudki na przestrzeni dni.

**Nagłówek:**
- Po lewej: tytuł "Wake Trend" + sub-label "Target 06:00" z mini legendą linii przerywanej
- Po prawej: średnia godzina pobudki (np. "05:50") + "Avg" pod spodem

**Wykres:**
- Typ: słupkowy (bar chart)
- Jeden słupek na dzień (7d/14d) lub na tydzień (30d)
- Ostatni słupek (dzisiaj / bieżący tydzień) wyróżniony kolorem
- Linia referencyjna przerywaną na target godzinie (06:00)
- Oś X: dni tygodnia (SAT, SUN, MON...) lub tygodnie (W02-19, W02-26...)

**Zachowanie przy zmianie zakresu:**
- 7d — 7 słupków dziennych
- 14d — 14 słupków dziennych
- 30d — 4-5 słupków tygodniowych (średnia z tygodnia)

### 7. Efficiency

Wykres efektywności snu (SE%) na przestrzeni dni.

**Nagłówek:**
- Po lewej: tytuł "Efficiency" + sub-label "Target 85%" z mini legendą linii przerywanej
- Po prawej: średnia SE (np. "88%") + "Avg" pod spodem

**Wykres:**
- Typ: area chart (linia z wypełnieniem pod spodem)
- Oś Y: procenty z "%" (np. 60%, 70%, 80%, 85%, 90%, 100%)
- 85% jako tick na osi + linia referencyjna przerywana
- Oś X: dni tygodnia (7d/14d) lub tygodnie (30d) — tak samo jak Wake Trend

**Zachowanie przy zmianie zakresu:**
- Identyczne jak Wake Trend (dzienny → tygodniowy)

---

## Stany puste

- **Brak danych (dzień 1):** KPI pokazują "—", wykresy: "Log your first night to see trends", insights: "Start logging to get insights"
- **Mało danych (<7 dni):** Pokaż dostępne dane, label adaptuje się
- **Brak danych dla danego dnia:** Przerwa/pusty slot w Sleep Pattern

---

## Kolejność scrollowania (podsumowanie)

1. Powitanie (data + "Good morning")
2. Dzisiejszy status (Last Night / prompt)
3. Sleep Pattern (zawsze 7 dni)
4. Insights
5. Trends: nagłówek + toggle + KPI cards
6. Wake Trend (reaguje na toggle)
7. Efficiency (reaguje na toggle)
