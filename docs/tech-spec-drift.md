# Tech Spec — Drift: Sleep Tracker

## 1. Overview

Drift is a mobile-first PWA built with React + Vite + TypeScript. All data is stored locally in IndexedDB via Dexie.js with a sync-ready schema (UUIDs, timestamps). The app runs entirely client-side with no backend. Recharts handles all visualizations. Service Worker provides offline support and local notifications.

## 2. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | React 18 + TypeScript | Largest ecosystem, strong charting library support |
| Build | Vite | Fast dev server, optimized PWA build |
| UI Components | shadcn/ui (Radix UI) | Accessible, customizable, copy-paste model — Card, Button, Dialog, Slider, Toggle, Sheet, Form |
| Styling | Tailwind CSS v4 | Utility-first, CSS variables for theming, small bundle with purge |
| Icons | lucide-react | Lightweight SVGs, tree-shakeable, consistent style |
| Storage | Dexie.js (IndexedDB) | Structured queries, offline-first, survives cache clear better than localStorage |
| Charts | Recharts | Declarative React API, custom shapes for sleep timeline, good mobile support |
| PWA | vite-plugin-pwa (Workbox) | Service Worker generation, manifest, offline caching |
| Notifications | Web Notification API | Local scheduling via Service Worker |
| Photoperiod | sunrise-sunset.org API | Free, no auth required, cached locally |
| Testing | Vitest + React Testing Library | Native Vite integration |
| Visual QA | Playwright | Screenshot feedback loop for UI verification |

## 3. Architecture

```
┌─────────────────────────────────────────────┐
│                   PWA Shell                  │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Views   │  │Components│  │  Hooks      │  │
│  │ Dashboard│  │ SleepBar │  │ useDb()    │  │
│  │ LogForm  │  │ KPICards │  │ useInsights│  │
│  │ Settings │  │ Charts   │  │ usePhoto() │  │
│  │ Experiment│ │ TagPicker│  │ useNotif() │  │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       │              │              │          │
│  ┌────▼──────────────▼──────────────▼──────┐  │
│  │            Dexie.js (IndexedDB)         │  │
│  │  sleepLogs | medications | experiments  │  │
│  │  medicationChanges | settings | tags    │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │         Service Worker (Workbox)        │  │
│  │   Offline cache | Notification scheduler│  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

Single-page app with client-side routing (React Router). No server. All computation (averages, trends, insights) happens in the browser.

## 4. Database Schema

All tables use UUID `id` as primary key. All records include `createdAt` and `updatedAt` (ISO 8601 strings). A `syncedAt` field (nullable) is reserved for future cloud sync.

### sleepLogs

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| date | string (YYYY-MM-DD) | Unique — one entry per day |
| bedtime | string (HH:MM) | Time got into bed |
| sleepOnset | string (HH:MM) | Estimated time fell asleep |
| wakeTime | string (HH:MM) | Final awakening |
| outOfBedTime | string (HH:MM) | Time got out of bed |
| alarmWake | boolean | true = alarm, false = spontaneous |
| sleepQuality | number (1–10) | Subjective quality |
| grogginess | number (0–10) | Morning grogginess |
| wakeUpMinutes | number (0–90) | Minutes to full alertness |
| awakenings | number (0–5) | Night awakening count |
| lightTherapyStart | string? (HH:MM) | Light session start |
| lightTherapyEnd | string? (HH:MM) | Light session end |
| lightTherapyIntensity | string? | Preset or free text |
| tags | string[] | Tag IDs |
| note | string? | Free-text note |
| experimentCondition | string? | Condition ID if experiment active |
| weeklyStress | number? (1–10) | Sunday only |
| weeklyActivity | string? | Sunday only — count + time description |
| weeklyInflammation | string[]? | Sunday only — symptom keys |
| weeklyRating | number? (1–10) | Sunday only |
| createdAt | string (ISO 8601) | |
| updatedAt | string (ISO 8601) | |
| syncedAt | string? (ISO 8601) | Reserved for v2 |

**Computed (not stored):** TST, TIB, SE%, SOL — calculated from stored times at read time.

**Index:** `date` (unique), `createdAt`.

### medications

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| name | string | Medication name |
| currentDose | string | Current dosage |
| active | boolean | Whether currently taking |
| createdAt | string | |
| updatedAt | string | |
| syncedAt | string? | |

### medicationChanges

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| medicationId | string | FK → medications.id |
| date | string (YYYY-MM-DD) | Date of change |
| previousDose | string | Dose before change |
| newDose | string | Dose after change |
| note | string? | Optional context |
| createdAt | string | |
| updatedAt | string | |
| syncedAt | string? | |

### experiments

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| name | string | Experiment title |
| conditionA | string | Label for condition A |
| conditionB | string | Label for condition B |
| status | string | "active" or "archived" |
| startDate | string (YYYY-MM-DD) | |
| endDate | string? (YYYY-MM-DD) | Set when archived |
| notes | string? | Closing notes |
| createdAt | string | |
| updatedAt | string | |
| syncedAt | string? | |

### tags

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| label | string | Display name |
| isDefault | boolean | Predefined vs user-created |
| createdAt | string | |
| updatedAt | string | |
| syncedAt | string? | |

**Default tags:** stress, alcohol, illness, travel, late coffee, exercise, stomach discomfort.

### settings

| Field | Type | Description |
|-------|------|-------------|
| key | string | Setting key (PK) |
| value | string (JSON) | Setting value |
| updatedAt | string | |

**Known keys:** `notificationTime`, `sleepWindowStart`, `sleepWindowEnd`, `sleepBarRangeStart`, `sleepBarRangeEnd`, `city`, `enabledExtendedFields`, `installedAt`.

## 5. API Endpoints

No backend API in v1. External API call:

### Sunrise-Sunset API
- **GET** `https://api.sunrise-sunset.org/json?lat={lat}&lng={lng}&date={date}&formatted=0`
- Called once per day, response cached in IndexedDB.
- City → coordinates mapping: use a small embedded lookup table (~50 Polish cities) or a one-time geocoding call stored in settings.

## 6. Folder Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Router, layout
├── sw.ts                     # Service Worker registration
├── db/
│   ├── index.ts              # Dexie database definition
│   ├── schema.ts             # Table schemas, migrations
│   └── seed.ts               # Default tags, settings
├── hooks/
│   ├── useDb.ts              # Generic CRUD operations
│   ├── useSleepLogs.ts       # Sleep log queries, computed fields
│   ├── useExperiments.ts     # Experiment CRUD + comparison
│   ├── useMedications.ts     # Medication list + changes
│   ├── useInsights.ts        # Insight generation logic
│   ├── usePhotoperiod.ts     # Sunrise/sunset API + cache
│   └── useNotifications.ts   # Notification scheduling
├── views/
│   ├── Dashboard.tsx          # Home: KPIs + charts + insights
│   ├── LogForm.tsx            # Daily logging form
│   ├── SeasonalView.tsx       # Long-term photoperiod view
│   ├── ExperimentView.tsx     # N-of-1 comparison
│   ├── ExperimentArchive.tsx  # Past experiments
│   ├── Settings.tsx           # All configuration
│   └── Onboarding.tsx         # First-run setup
├── components/
│   ├── SleepBar/
│   │   ├── SleepBar.tsx       # Main sleep bar component
│   │   ├── Handle.tsx         # Drag handle
│   │   └── TimeLabel.tsx      # Range display
│   ├── charts/
│   │   ├── SleepTimeline.tsx  # Horizontal bar chart
│   │   ├── WakeTimeTrend.tsx  # Line + moving average
│   │   ├── EfficiencyChart.tsx# SE% line + 85% ref
│   │   └── ComparisonChart.tsx# N-of-1 bar chart
│   ├── KPICards.tsx           # Metric cards row
│   ├── TagPicker.tsx          # Tag multi-select
│   ├── InsightsPanel.tsx      # Auto-generated observations
│   ├── MedicationPanel.tsx    # Med list + changes
│   └── WeeklyReview.tsx       # Sunday extra section
├── utils/
│   ├── sleep-math.ts          # TST, TIB, SE, SOL calculations
│   ├── date.ts                # Date helpers, cross-midnight time math
│   ├── uuid.ts                # UUID generation
│   └── insights-engine.ts     # Pattern detection rules
├── types/
│   └── index.ts               # TypeScript interfaces
└── styles/
    └── globals.css             # Tailwind base + custom properties
```

## 7. Component Hierarchy

```
App
├── Onboarding (first run only)
├── Dashboard
│   ├── KPICards
│   ├── TimeRangeToggle (7/14/30)
│   ├── SleepTimeline
│   ├── WakeTimeTrend
│   ├── EfficiencyChart
│   └── InsightsPanel
├── LogForm
│   ├── DatePicker (backfill)
│   ├── SleepBar
│   │   ├── Handle (×3: bedtime, wake, out-of-bed)
│   │   └── TimeLabel
│   ├── CoreFields (alarm, quality, grogginess, alertness time)
│   ├── ExtendedFields (light therapy, awakenings, note)
│   ├── TagPicker
│   ├── MedicationPanel (if meds defined)
│   ├── ExperimentConditionPicker (if experiment active)
│   ├── WeeklyReview (if Sunday)
│   └── SaveButton
├── SeasonalView
│   └── SeasonalChart (wake time + TST + photoperiod)
├── ExperimentView
│   ├── ExperimentSetup (create/edit)
│   └── ComparisonChart
├── ExperimentArchive
│   └── ArchivedExperimentCard (×n)
└── Settings
    ├── NotificationConfig
    ├── SleepWindowConfig
    ├── SleepBarRangeConfig
    ├── CityConfig
    ├── ExtendedFieldToggles
    ├── TagManager
    ├── MedicationManager
    └── DataExportImport
```

**State management:** React Context for settings (read frequently, change rarely). All other data read from Dexie.js via hooks — no global state store needed. Dexie's `liveQuery` provides reactive updates.

## 8. Authentication & Authorization

None in v1. Single user, local data. No accounts, no roles, no sessions.

**Sync-ready consideration:** When v2 adds Google Auth, the UUID-based schema allows merging local data with cloud without ID conflicts.

## 9. Error Handling

| Layer | Strategy |
|-------|----------|
| IndexedDB | Dexie wraps errors. Show toast "Failed to save — try again". Never lose user input — keep form state on error. |
| Sunrise API | Fail silently — photoperiod is supplementary. Cache last known value. Show "—" if no data. |
| Notifications | If permission denied, show one-time banner explaining value. Never re-prompt. |
| Service Worker | If registration fails, app works normally without offline/notification support. |
| Sleep bar | Prevent invalid states (wake before sleep, out-of-bed before wake) via handle constraints. |

## 10. Testing Strategy

| Type | Scope | Tools |
|------|-------|-------|
| Unit | sleep-math.ts, insights-engine.ts, date utils | Vitest |
| Component | SleepBar interactions, form validation, chart rendering | Vitest + React Testing Library |
| Integration | Full log flow: fill form → save → verify in DB → see on dashboard | Vitest + RTL |
| E2E | Critical path: open → log → dashboard shows entry | Playwright (later) |

**Priority:** Unit tests for calculations (TST, SE, SOL — these must be correct). Component tests for SleepBar (complex interaction logic). Integration tests for save/display flow.

## 11. Dependencies & Integrations

| Dependency | Purpose | Risk |
|-----------|---------|------|
| sunrise-sunset.org | Photoperiod data | Free API, no SLA. Mitigated by local caching. |
| Chrome on Android | PWA host, notifications | Primary platform. Well-supported. |
| Dexie.js | IndexedDB wrapper | Mature, actively maintained, 0 dependencies. |
| Recharts | Charts | Large-ish bundle (~200KB). Acceptable for PWA with caching. |

**No other external services.** App is fully self-contained.

## 12. Open Technical Questions

1. **SleepBar touch handling** — Need to prototype the swipe-to-select + handle adjustment UX. May need `pointer events` API vs. `touch events` for best cross-device support.
2. **Cross-midnight time math** — Bedtime 23:00 + wake 06:00 spans midnight. All time calculations need to handle this. Likely store as minutes-from-midnight with wrap logic, or store full datetime.
3. **Notification reliability** — Service Worker local notifications on Android: test how aggressive battery optimization is across Samsung, Xiaomi, Pixel. Document workaround if needed (instruct user to disable battery optimization for Chrome).
4. **Recharts bundle size** — Consider tree-shaking or lazy-loading chart components to reduce initial load.
5. **City → coordinates mapping** — Embedded lookup table vs. one-time geocoding API call. Embedded is simpler and works offline.
