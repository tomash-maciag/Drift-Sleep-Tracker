# PRD — Drift: Sleep Tracker

## 1. Introduction/Overview

Drift is a minimalist, mobile-first PWA for daily sleep logging and analysis. It targets patients with chronic sleep disorders (particularly terminal insomnia with seasonal component) who are running CBT-I, chronotherapy, pharmacotherapy, or N-of-1 experiments and need consistent, low-friction tracking to evaluate whether interventions work.

**Core problem:** Existing sleep diary apps are either too generic (missing fields for chronotherapy, inflammation, medication context) or too complex (too many fields = user stops logging after a week). Logging consistency matters more than data volume — the app must cost max 2 minutes in the morning.

## 2. Goals

1. **Daily logging in <60 seconds** on good days, <120 seconds when there are changes.
2. **Weekly trend visibility** — user and doctor see whether an intervention is working without analyzing individual nights.
3. **N-of-1 experiment support** — define conditions, assign days, compare means automatically.
4. **Backfill support** — log past days without limit to build historical data from paper notes.
5. **Sync-ready architecture** — local-only in v1, but data model prepared for cloud sync in v2.

## 3. User Stories

### Daily Logging
- As a user, I want to swipe across a time bar to mark my sleep range, so that logging bedtime and wake time takes one gesture.
- As a user, I want to adjust the sleep range with drag handles after the initial swipe, so I can correct to 15-minute precision.
- As a user, I want a third handle to mark "time in bed after waking" (grogginess/lying period), so the app calculates TIB vs TST accurately.
- As a user, I want core fields pre-filled with yesterday's values, so I only correct differences.
- As a user, I want to save with only core fields filled, so extended fields never block logging.
- As a user, I want to tag days with predefined or custom tags (stress, alcohol, illness, travel, late coffee, exercise, stomach discomfort), so I can correlate factors with sleep quality.
- As a user, I want to select a date from a calendar and log past nights without limit, so I can backfill history from paper notes.

### Extended Logging
- As a user, I want to log light therapy sessions (start time, end time, intensity/distance), so I can see correlation with sleep quality.
- As a user, I want to manage a medication list and log changes with dates, so I have a pharmaceutical timeline in one place.
- As a user, I want to record night awakenings as a count (0–5+), so the data captures sleep fragmentation.
- As a user, I want to add a free-text note for exceptional circumstances.

### Weekly Review
- As a user, I want to fill a weekly review (stress, physical activity, inflammatory symptoms, overall week rating) as an extra section in Sunday's daily log, so I don't need a separate session.

### Dashboard & Visualization
- As a user, I want to see KPI cards (avg TST, avg wake time, avg SE%, trend arrow) at the top of the dashboard.
- As a user, I want a sleep timeline chart (horizontal bars per day, color-coded by quality) to see my sleep pattern at a glance.
- As a user, I want a wake time trend line with 7-day moving average to track circadian phase shifts.
- As a user, I want a sleep efficiency chart with an 85% reference line.
- As a user, I want to switch between 7/14/30 day views with a toggle.
- As a user, I want a seasonal view showing wake time and TST against photoperiod (day length) over months.
- As a user, I want an insights section on the dashboard with auto-generated observations (e.g., "SE below 80% for 5 days", "wake time shifted 20 min earlier vs last week").

### N-of-1 Experiments
- As a user, I want to define an experiment with two labeled conditions (free text), so I can name protocols.
- As a user, I want to assign each day to a condition (or none) during daily logging.
- As a user, I want to see automatic comparison of means (avg wake time, TST, quality) between conditions with spread visualization.
- As a user, I want to close an experiment and archive it with results and notes, so I can review past experiments.
- As a user, I want only one active experiment at a time.

### Configuration & Onboarding
- As a user, I want to set my notification time during onboarding.
- As a user, I want to set my target sleep window (bedtime, wake time) for SE calculation.
- As a user, I want to toggle individual extended fields on/off in settings.
- As a user, I want to configure the sleep bar range (default 23:00–9:00) in settings.
- As a user, I want to set my city once for automatic sunrise/sunset data.
- As a user, I want to manage my tag list (add/remove) in settings.

### Continuity
- As a user, I want a morning push notification at a configurable time.
- As a user, I want an evening nudge if I haven't logged today.
- As a user, I want a simple streak counter (no gamification, silent reset).
- As a user, I want to export/import my data as JSON for backup.

## 4. Functional Requirements

### FR-01: Sleep Bar Input Component
- Display a horizontal time bar spanning a configurable range (default 23:00–9:00).
- 15-minute resolution (4 boxes per hour).
- Swipe gesture marks sleep range; two handles appear for fine adjustment.
- Third handle extends from wake time to mark "lying in bed" period (lighter color).
- Minimal tick labels (start, middle, end) + selected range displayed as "HH:MM – HH:MM" text.
- Two visual states: sleep (dark) and lying/awake (light).
- Portrait orientation, full width.

### FR-02: Auto-Calculated Fields
- TST (Total Sleep Time) = wake time − sleep onset
- TIB (Time In Bed) = out-of-bed time − bedtime
- SE (Sleep Efficiency) = TST / TIB × 100%
- SOL (Sleep Onset Latency) = sleep onset − bedtime

### FR-03: Daily Log Form
- Core fields: sleep bar (bedtime, sleep onset, wake time, out-of-bed time), alarm vs spontaneous (toggle), sleep quality (1–10 slider), morning grogginess (0–10 slider), wake-up time to full alertness (0–90 min).
- Extended fields (togglable): light therapy (start, end, intensity/distance preset), medication changes (from medication list), night awakenings (0–5+ stepper), free-text note.
- Tags section: predefined + custom tags, multi-select.
- Pre-filled with previous day's values.
- Weekly review section appears on Sundays: stress (1–10), physical activity (count + time of day), inflammatory symptoms (multi-toggle: back pain / morning stiffness / psoriasis flare / none), overall week rating (1–10).
- Date picker allows selecting any past date.

### FR-04: Dashboard
- KPI cards: avg TST (7d), avg wake time (7d), avg SE% (7d), trend vs previous period (↑↓→).
- Sleep timeline chart: horizontal bars, color-coded by quality.
- Wake time trend: line chart with 7-day moving average.
- Sleep efficiency: line chart with 85% reference line.
- Time range toggle: 7 / 14 / 30 days.
- Insights section: auto-generated text observations based on data patterns.

### FR-05: Seasonal View
- Wake time and TST plotted over months.
- Photoperiod (day length) curve in background.
- Available when data spans > 8 weeks.

### FR-06: N-of-1 Experiments
- Create experiment: two conditions with text labels.
- Daily log: optional condition assignment.
- Comparison view: side-by-side means for wake time, TST, quality with min-max/SD spread.
- Archive experiment: save with notes, results remain viewable.
- Max one active experiment.

### FR-07: Medication List
- Define medications (name, current dose).
- Log changes: new dose, date, optional note. Creates timeline event.
- Display at daily log: "Medications: no changes ✓" or tap to edit.
- Optional — not shown if no medications defined.

### FR-08: Notifications
- Morning notification at configurable time (Service Worker, local).
- Evening missed-day nudge.
- Sunday weekly review reminder (part of daily notification).

### FR-09: Data Management
- Manual JSON export/import via settings.
- All records use UUID primary keys, createdAt/updatedAt timestamps (sync-ready).

### FR-10: Photoperiod Data
- City set once in settings.
- Sunrise/sunset fetched from API (sunrise-sunset.org).
- Day length calculated automatically.
- DST transitions marked on timeline.

## 5. Non-Goals (Out of Scope)

- **No medical diagnosis or advice.** App reports facts, never evaluates.
- **No wearable integration.** Subjective diary only — no HR, HRV, sleep stages.
- **No social features.** No sharing, community, or comparisons with others.
- **No gamification.** No badges, points, rewards. Streak counter is the maximum.
- **No user accounts in v1.** Local data, zero sign-up barriers.
- **No cloud sync in v1.** Sync-ready data model, but no backend.
- **No doctor report export in v1.** Deferred to later version.
- **No CSV import.** Backfill via manual date-picker logging.
- **No onboarding profiles.** All fields available, toggle in settings.

## 6. Design Considerations

- **Mobile-first PWA** — optimized for Android Chrome, portrait orientation.
- **Sleep bar** is the hero component — must feel smooth, responsive, satisfying to use.
- **Notification opens directly to log form** — zero intermediate screens.
- **Big "Save" button** at bottom — one tap to finish.
- **Muted, calm color palette** — dark blues for sleep, soft grays, no aggressive colors.
- **Minimal text, maximum touch targets** — sliders and toggles over text inputs.
- **Dashboard is the home screen** — logging is accessed via FAB or notification.

## 7. Technical Considerations

- **Stack:** React + Vite + TypeScript, Recharts for visualization, Dexie.js (IndexedDB) for storage.
- **PWA:** Service Worker for offline, Web App Manifest for install.
- **Sync-ready:** UUID PKs, createdAt/updatedAt on all records, syncedAt field for future use.
- **Notifications:** Service Worker + Notification API (local scheduling).
- **Photoperiod:** sunrise-sunset.org free API, cached locally per day.
- **No backend in v1.**

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Logging retention | >80% days with entry in first month | Entries / days since install |
| Logging time | Median <90 seconds | Time from form open to save |
| N-of-1 usage | ≥1 experiment in first 2 months | Event count |
| Data backfill | User completes historical data entry | Entry count for past dates |
| Subjective usefulness | User reports value at doctor visit | Qualitative |

## 9. Open Questions

- Exact predefined tag list — finalize during implementation (initial: stress, alcohol, illness, travel, late coffee, exercise, stomach discomfort).
- Light therapy intensity presets — what distances/options to offer.
- Insights engine rules — which patterns to detect beyond SE<80% and wake time shift.
