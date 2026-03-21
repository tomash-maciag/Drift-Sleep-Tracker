# Dashboard — Design Brief

Drift is a minimalist sleep tracking app for Android. The dashboard is the home screen — the user opens it every morning after logging sleep and throughout the day to check trends. The screen is designed for a phone (~360px wide, portrait only). Context of use: morning (groggy, low attention span) and evening (reviewing data before sleep).

---

## Fixed elements

### App identity bar

Always visible at the top of the screen. Its only purpose is to confirm the user is in Drift. It contains the app name and nothing else — no actions, no notifications, no profile. The app is single-user and local, so there's nothing to configure here.

### Primary action

There is one primary action available from the dashboard at all times: logging a new sleep entry. This should be immediately accessible regardless of scroll position. It opens the sleep logging form for today's date.

### Screen navigation

The app has three top-level destinations: the dashboard (home), experiments, and settings. The user needs a way to switch between them. Home is always the active/default destination when the app opens.

---

## Scrollable content

### 1. Greeting

The first thing the user sees after opening the app. It establishes temporal context — what day it is and what time of day. This matters because sleep data is inherently tied to "last night" and "this week", so the user needs to know where they are in time.

The greeting adapts to the time of day: a morning greeting before noon, an afternoon one between noon and evening, and an evening one after 18:00. It also shows today's date in a readable format (e.g. "Friday, Mar 21").

This section has no interactive elements — it's purely orientational.

### 2. Last night summary

This section answers the most immediate question: "How did I sleep last night?"

**When today's sleep has been logged**, it shows a compact summary of three key numbers from the most recent entry:
- How long the user slept (e.g. "7h 20m")
- When they woke up (e.g. "06:30")
- Their sleep efficiency as a percentage (e.g. "92%")

These three values together give an instant picture of the night. The user doesn't need to scroll further if they just want a quick check.

**When today's sleep has NOT been logged**, this section becomes a prompt encouraging the user to log. It should communicate that today's entry is missing and make it easy to start logging — ideally one tap. This is critical for retention: the app depends on daily consistency.

### 3. Sleep Pattern

This is the hero visualization of the dashboard. It answers: "What did my sleep look like this week?"

It always shows the last 7 days, regardless of any period selector elsewhere on the screen. Seven days is the natural rhythm for sleep patterns — enough to see a trend, not so much that the chart becomes unreadable.

For each of the 7 nights, the chart shows:
- **When the user was in bed** — the full span from getting into bed to getting out of bed
- **When they were actually sleeping** — the narrower span from falling asleep to waking up
- **Which day of the week** it was (e.g. MON, TUE...)
- **How long they slept** that night (e.g. "6h 45m")

These two overlapping ranges ("in bed" vs "asleep") are important because the difference between them reveals sleep onset latency (how long it takes to fall asleep) and morning lingering (how long the user stays in bed after waking). Both are clinically relevant.

Sleep quality affects how each night looks — a bad night (quality 3-4) should feel visually different from a good night (quality 8-9). The exact mechanism is up to the designer (opacity, color, size, etc.).

The chart also shows the user's **desired sleep window** — the time range they've configured as their target bedtime and wake time (e.g. midnight to 7am). This helps the user see at a glance whether they're staying within their target or drifting. The window boundaries come from user settings and can change.

A time axis runs along the chart so the user can read approximate times (the range is typically 22:00 to 10:00, but it's configurable).

**Mock data for design:**
- SAT — bedtime 23:00, wake 06:15, quality 8
- SUN — bedtime 23:00, wake 06:30, quality 8
- MON — bedtime 23:15, wake 04:30, quality 4
- TUE — bedtime 23:00, wake 05:00, quality 5
- WED — bedtime 23:30, wake 05:15, quality 5
- THU — bedtime 23:00, wake 05:30, quality 6
- FRI — bedtime 23:15, wake 05:45, quality 6

### 4. Insights

Auto-generated observations about the user's sleep data. The app analyzes patterns and surfaces notable findings in plain language. These are factual statements, never judgments — the app reports, it doesn't evaluate.

There are two severity levels:
- **Warning** — something the user should pay attention to (e.g. efficiency dropping below a clinical threshold for multiple days)
- **Informational** — a neutral observation, often a positive trend (e.g. wake time improving)

Maximum 3 insights are shown at a time. If there's nothing notable, this section can be empty or hidden.

This section should feel visually distinct from the data cards around it — it's commentary, not data. It should draw enough attention to be read but not alarm the user.

**Example insights:**
- "Sleep efficiency below 80% for 5 consecutive days."
- "Wake time shifted 25 min later vs. previous week — positive trend."
- "Average sleep quality improved from 5.3 to 7.4 over last 7 days."

### 5. Trend metrics

This section answers: "How am I doing overall?" It provides aggregate numbers over a selectable time period.

**Period selector:** The user can choose between 7 days, 14 days, or 30 days. This selection controls everything in this section and in the two charts below (Wake Trend and Efficiency). It does NOT affect Sleep Pattern above, which always shows 7 days.

**Four key metrics:**
- **Sleep Time** — average sleep duration for the selected period. Typical range: 4h–9h. Example: "6h 40m"
- **Efficiency** — average sleep efficiency (time asleep divided by time in bed). Typical range: 60%–100%. Example: "88%"
- **Wake Up** — average wake-up time. Typical range: 04:00–08:00. Example: "05:50"
- **Trend** — whether sleep is improving, declining, or stable compared to the previous period of the same length. Always one of three states: improving, declining, or stable.

All time values are rounded to the nearest 5 minutes for readability.

### 6. Wake Trend

This chart answers: "Is my wake-up time getting earlier or later?"

Wake-up time is the most sensitive indicator of circadian phase drift — the core concern for users with terminal insomnia. Even a 15-minute shift over a week is clinically significant.

The chart shows wake-up time over the selected period with a reference line at the user's target wake time (e.g. 06:00, configurable in settings). The user should immediately see whether they're trending toward or away from their target.

The chart also displays the period's average wake time as a summary number.

**Behavior across periods:**
- 7 days: one data point per day, labeled by day of the week (SAT, SUN, MON...)
- 14 days: one data point per day
- 30 days: data aggregated into weekly averages (4-5 data points), labeled by week

The most recent data point (today or current week) should be visually distinguished from the rest — it represents "now".

### 7. Efficiency

This chart answers: "Is my sleep efficiency improving?"

Sleep efficiency (SE%) is the ratio of time asleep to time in bed. The clinical threshold is 85% — above that is considered good. Below 80% for extended periods suggests the sleep window may need adjustment.

The chart shows SE% over the selected period with a reference line at 85%. The Y-axis runs from roughly 60% to 100% with percentage labels. The user should be able to see at a glance whether they're above or below the 85% threshold and whether the trend is improving.

The chart also displays the period's average SE% as a summary number.

**Behavior across periods:**
- Identical to Wake Trend: daily for 7d/14d, weekly averages for 30d.

---

## Empty states

The app needs to handle three scenarios gracefully:

- **First day (no data at all):** All metrics show placeholder values. Charts display an encouraging message to log the first night. The primary action (log sleep) should feel especially prominent.

- **Partial data (fewer than 7 days):** Show whatever data exists. Labels should adapt to reflect the actual count (e.g. if only 3 days of data exist, don't claim "7 day average").

- **Missing individual days:** Gaps in the Sleep Pattern chart where no entry exists. The chart should make it clear that data is missing, not that the user slept zero hours.

---

## Content hierarchy (scroll order)

1. Greeting — temporal orientation
2. Last night summary — immediate answer to "how did I sleep?"
3. Sleep Pattern — weekly visual overview
4. Insights — notable observations
5. Trend metrics — aggregate numbers with period selector
6. Wake Trend — circadian drift tracking
7. Efficiency — sleep quality tracking
