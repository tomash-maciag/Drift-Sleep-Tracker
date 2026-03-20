# UI & Design System Guide for Claude Code
## Next.js + Tailwind CSS v4 + shadcn/ui + Supabase

> This guide defines how to set up the environment, which skills to use, and how to consistently produce high-quality UI. Follow every section before writing any component code.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 — utility classes only |
| Component Library | shadcn/ui (Radix UI primitives) |
| Icons | `lucide-react` SVGs only |
| Theming | `next-themes` + CSS variables in `globals.css` |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| Package Manager | pnpm |

---

## 2. Required Skills — Install Before Starting

### 2.1 Core UI Skills

```bash
# 1. Anthropic's frontend-design skill — prevents AI slop, enforces design quality
git clone https://github.com/anthropics/skills.git
cp -r skills/skills/frontend-design ~/.claude/skills/

# 2. Vercel web-design-guidelines — 100+ accessibility and UX rules
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code

# 3. Vercel react-best-practices — Next.js / React 19 performance rules
npx skills add vercel-labs/agent-skills --skill react-best-practices -a claude-code

# 4. Official shadcn/ui skill — Claude knows your installed components
npx shadcn skill add

# 5. Tailwind v4 + shadcn compatibility fix (if using Tailwind v4)
npx -y @lobehub/market-cli skills install ederheisler-agent-skills-tailwind-v4-shadcn --agent claude-code
```

### 2.2 Supabase Skills

```bash
# Official Supabase agent-skills (Postgres best practices, RLS, migrations)
git clone https://github.com/supabase/agent-skills.git
cp -r agent-skills/skills/supabase-postgres-best-practices ~/.claude/skills/
```

---

## 3. CLAUDE.md — Project-Level Rules

Add the following to your project's `CLAUDE.md`. Claude reads this at the start of every session.

```markdown
## Tech Stack
- Next.js App Router + React 19 + TypeScript
- Tailwind CSS v4 (utility classes only — NO new CSS files)
- shadcn/ui components (Radix UI primitives)
- lucide-react for all icons
- next-themes for dark mode
- Supabase (Postgres, Auth, Edge Functions)
- pnpm

## UI Hard Rules — NEVER violate these
- DO NOT create new CSS files. All styling via Tailwind utilities.
- DO NOT add new colors outside CSS variables in globals.css.
- DO NOT use emoji as icons — use lucide-react SVGs only.
- DO NOT use these overused AI fonts: Inter, Roboto, Space Grotesk.
- DO NOT add micro-animations everywhere — one orchestrated reveal per page load only.
- DO NOT introduce new dependencies without asking first.
- ALWAYS use shadcn/ui components for: forms, cards, dialogs, tables, buttons, inputs.
- ALWAYS use mobile-first responsive design (sm → md → lg breakpoints).
- ALWAYS add dark mode support via CSS variables.
- ALWAYS add cursor-pointer to clickable elements.
- ALWAYS use transition duration 150–300ms only.
- ALWAYS use semantic HTML (section, article, nav, header, main, footer).
- ALWAYS provide aria-label / aria-describedby on interactive elements.
- ALWAYS ensure min 44px touch targets on mobile.

## Supabase Rules
- Every new feature MUST include a section: required migrations, RLS policies, edge functions.
- NEVER expose service role key on client side.
- ALWAYS enable RLS on every new table.
- Use Supabase MCP if available — Claude can read the live schema directly.

## Design Principles
- Negative space is a feature — do not fill every pixel.
- Asymmetric layouts are preferred over rigid grids.
- Typography pairs: one serif display + one sans-serif body, or two contrasting sans-serifs.
- Color palette: dominant neutral + one sharp accent. Max 3 main colors.
- Cohesive CSS-variable-based color system — no hardcoded hex values in components.
```

---

## 4. design-guidelines.md — Project Design System

Run this **once per project** to generate a design system reference file:

```
Analyze all existing components in src/components, globals.css, and tailwind.config.ts.
Generate a file called design-guidelines.md containing:
1. All CSS custom properties (colors, spacing, radius, shadows)
2. Typography scale and font pairings in use
3. Spacing scale (padding, margin, gap conventions)
4. Component patterns with usage examples (Card, Button variants, Form layouts)
5. Recurring layout patterns (page shell, section wrapper, content grid)
6. Dark mode token mapping
Save to docs/design-guidelines.md
```

Reference `docs/design-guidelines.md` in every subsequent component prompt to maintain consistency.

---

## 5. Feedback Loop — How to Iterate on UI

Claude cannot see what it builds unless given a feedback mechanism. Use one of these approaches:

### Option A: Playwright Screenshot Loop (Recommended)
```
Build the [component]. Start the dev server. Take a screenshot with Playwright.
Review the screenshot. Fix any visual issues. Repeat until the UI looks polished.
```

### Option B: Browserbase / Traycer MCP
Connect a browser MCP so Claude autonomously opens the page, takes screenshots, and evaluates the result without manual intervention.

### Option C: Manual Screenshot Feedback
Take a screenshot yourself → paste into Claude Code → describe what needs fixing. Most effective when combined with annotating specific elements.

---

## 6. Visual References — "Show, Don't Describe"

Claude produces significantly better UI when given a visual reference rather than a text description.

- **Figma MCP**: Connect Claude Code to your Figma file. Claude reads designs directly.
- **Production screenshot**: Paste a screenshot of a site you like and say "similar vibe, use our components."
- **Annotated screenshot**: Mark up an existing screen with arrows and notes for targeted changes.
- **Figma ↔ Code plugin**: Use the official "Claude Code to Figma" plugin (released Feb 2026) to export working UI into Figma as editable frames.

---

## 7. Skill Activation Cheat Sheet

| Task | Skill / Command to invoke |
|---|---|
| Build a new page or view | `/frontend-design` |
| Review component for a11y and UX | `/web-design-guidelines src/components/**/*.tsx` |
| Add a new shadcn component | `npx shadcn add [component]` + shadcn skill active |
| Write a new feature with DB | Include Supabase section in PRD (migrations, RLS, edge functions) |
| Audit Tailwind v4 integration | `tailwind-v4-shadcn` skill |
| Check React / Next.js patterns | `/react-best-practices` |

---

## 8. What Skills Cannot Replace

Skills enforce rules but do not guarantee visual quality. The following always require human judgment:

- **Final polish**: exact `letter-spacing`, `line-height`, shadow values — faster to tweak live in browser.
- **Visual hierarchy**: Claude may technically follow rules but miss what the eye focuses on first.
- **Brand feel**: "feels premium / playful / serious" requires a reference or explicit words.
- **Motion**: review all transitions manually — Claude over-animates without oversight.

**Rule of thumb**: Use Claude for structure and component wiring. Do final visual polish yourself or via screenshot iteration. Expect 5–10 visual iteration rounds for production-quality screens.

---

## 9. Recommended Workflow

```
1. PRD (snarktank/ai-dev-tasks create-prd.md — include Supabase section)
      ↓
2. DB Schema (Supabase MCP + supabase-postgres-best-practices skill)
      ↓
3. Component scaffold (/frontend-design skill + design-guidelines.md reference)
      ↓
4. Screenshot loop (Playwright or browser MCP)
      ↓
5. a11y review (/web-design-guidelines)
      ↓
6. Manual polish (browser DevTools)
      ↓
7. Export to Figma (Claude Code → Figma plugin) — optional for design review
```
