# Dashboard — Content & Structure Spec v2

Main screen of Drift. The user opens it every morning after logging sleep and throughout the day to check trends. Device: Android phone, ~360px, portrait.

---

## Fixed elements

### Top App Bar
- Left: app icon + "DRIFT" text
- Right: nothing (minimalist)
- Sticky at the top, always visible

### FAB (action button)
- "+" icon — opens sleep logging form
- Position: bottom-right corner, above navigation

### Bottom Navigation
- 3 tabs: Home (active), Experiments, Settings
- Each tab: icon + label
- Fixed at the bottom of the screen

---

## Scrollable content (top to bottom)

### 1. Greeting
- Line 1: today's date, e.g. "FRIDAY, MAR 21"
- Line 2: contextual greeting — "Good morning" (before 12:00), "Good afternoon" (12:00–18:00), "Good evening" (after 18:00)

### 2. Today's status

**When the user has logged today's sleep:**
- Label: "Last Night"
- Three values side by side, separated by dividers:
  - Sleep duration + label "sleep", e.g. "7h 20m sleep"
  - Wake time + label "wake", e.g. "06:30 wake"
  - Efficiency as percentage, e.g. "92%"

**When the user has NOT logged today's sleep:**
- Encouraging text: "Log today's sleep"
- Below: "Tap to record last night"
- "+" button on the right

### 3. Sleep Pattern

Always shows the last 7 days (does not react to the toggle).

**Header:**
- Left: title "Sleep Pattern" + sub-label "Sleep window" with a mini dashed-line legend
- Right: "7 Days" + legend of two colors: "In bed" and "Sleep"

**Chart:**
- One horizontal bar per day (7 bars)
- Each bar has two states: "in bed" (full range from bedtime to getting out of bed) and "sleep" (from falling asleep to waking up) — overlapping
- Two vertical dashed lines marking the desired sleep window (e.g. 00:00 and 07:00)
- Time axis at the bottom: 22:00, 00:00, 03:00, 07:00, 10:00
- Each bar has: day of the week on the left (MON, TUE...), sleep duration on the right (e.g. "6h 45m")
- Sleep quality affects bar visibility (worse night = more dimmed)

**Mock data:**
- SAT — bedtime 23:00, wake 06:15, quality 8
- SUN — bedtime 23:00, wake 06:30, quality 8
- MON — bedtime 23:15, wake 04:30, quality 4
- TUE — bedtime 23:00, wake 05:00, quality 5
- WED — bedtime 23:30, wake 05:15, quality 5
- THU — bedtime 23:00, wake 05:30, quality 6
- FRI — bedtime 23:15, wake 05:45, quality 6

### 4. Insights

Auto-generated text observations. Neutral, factual — never judgmental.

- Label: "Insights"
- Max 3 entries
- Each entry has a type:
  - Warning (⚠) — something to pay attention to
  - Info (→) — neutral observation
- Visual distinction: an element that differentiates this section from regular cards (e.g. accent on the left edge)

**Example content:**
- ⚠ "SE below 80% for 5 consecutive days."
- → "Wake time shifted 25 min later vs. previous week — positive trend."
- → "Average sleep quality improved from 5.3 to 7.4 over last 7 days."

### 5. Trends — header + KPIs + toggle

Analytical section. The toggle controls KPIs, Wake Trend, and Efficiency below.

**Header:**
- Left: sub-label "OVERVIEW" + title "Trends"
- Right: toggle with three options — "7d" / "14d" / "30d"

**Four KPI cards in a 2×2 grid:**

- **Sleep Time** — average sleep duration for the selected period, e.g. "6h 40m"
- **Efficiency** — average sleep efficiency, e.g. "88" + "%"
- **Wake Up** — average wake time, e.g. "05:50"
- **Trend** — direction icon + text: "↑ Improving" / "↓ Declining" / "→ Stable"

Each card: label on top, value on bottom.
Values rounded to nearest 5 minutes.
Labels do not include a period suffix — the period is implied by the toggle.

### 6. Wake Trend

Chart showing how wake-up time changes across days.

**Header:**
- Left: title "Wake Trend" + sub-label "Target 06:00" with a mini dashed-line legend
- Right: average wake time (e.g. "05:50") + "Avg" below

**Chart:**
- Type: bar chart
- One bar per day (7d/14d) or per week (30d)
- Last bar (today / current week) highlighted with accent color
- Dashed reference line at the target time (06:00)
- X-axis: days of the week (SAT, SUN, MON...) or weeks (W02-19, W02-26...)

**Behavior on range change:**
- 7d — 7 daily bars
- 14d — 14 daily bars
- 30d — 4-5 weekly bars (weekly average)

### 7. Efficiency

Sleep efficiency (SE%) chart over time.

**Header:**
- Left: title "Efficiency" + sub-label "Target 85%" with a mini dashed-line legend
- Right: average SE (e.g. "88%") + "Avg" below

**Chart:**
- Type: area chart (line with fill underneath)
- Y-axis: percentages with "%" (e.g. 60%, 70%, 80%, 85%, 90%, 100%)
- 85% as a tick on the axis + dashed reference line
- X-axis: days of the week (7d/14d) or weeks (30d) — same as Wake Trend

**Behavior on range change:**
- Identical to Wake Trend (daily → weekly)

---

## Empty states

- **No data (day 1):** KPIs show "—", charts: "Log your first night to see trends", insights: "Start logging to get insights"
- **Partial data (<7 days):** Show available data, labels adapt accordingly
- **Missing day:** Gap/empty slot in Sleep Pattern

---

## Scroll order (summary)

1. Greeting (date + "Good morning")
2. Today's status (Last Night / prompt)
3. Sleep Pattern (always 7 days)
4. Insights
5. Trends: header + toggle + KPI cards
6. Wake Trend (reacts to toggle)
7. Efficiency (reacts to toggle)
