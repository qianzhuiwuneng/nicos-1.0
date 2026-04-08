# Nicos 1.0

A **personal operating system** for beauty, taste, feelings, and becoming. Not a productivity app — a place to record change, capture feelings, spot patterns, and build your own style system.

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **lucide-react** icons
- Mock data only (no backend)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route       | Description                          |
|------------|--------------------------------------|
| `/`        | Dashboard — welcome, quick actions, weekly focus, monthly overview, recent entries, inspiration, quick links |
| `/ledger`  | Growth-led spending (categories, effectiveness, repurchase) |
| `/feelings`| Daily feeling log (mood, energy, moments, confirmed, eliminated) |
| `/looks`   | Look archive by occasion (gallery, detail modal) |
| `/taste`   | Aesthetic input (movies, books, exhibitions, brands, etc.) |
| `/weekly`  | Weekly reflection (theme, best/worst, next micro-adjustments) |
| `/monthly` | Monthly reflection (keywords, worth it / not, next focus) |
| `/templates` | Stable templates (repeatable formulas) |
| `/to-try`  | To try list (Want to try / Planned / Tried / Archived) |
| `/identity`| Identity notes (who you’re becoming, elegance, style keywords) |

## Project structure

```
app/                    # Routes (page.tsx per section)
components/
  layout/               # Sidebar, Topbar, AppLayout
  dashboard/            # Dashboard sections (Welcome, QuickActions, etc.)
  shared/               # StatCard, SectionCard, LookCard, DetailModal, etc.
  ui/                   # Button, Card, Badge, Tabs, Dialog
lib/
  types.ts              # TypeScript types for all entities
  data.ts               # Mock data
  utils.ts              # cn()
```

## Design

- **Palette:** Cream background (`#faf9f7`), warm gray, soft accent (`#e8dcd5`), primary taupe (`#8b7355`).
- **Tone:** Minimal, soft, editorial, calm. No corporate blue, no heavy gradients.
- **Interaction:** Sidebar navigation, tabs for filters, card click → detail modal, quick actions show “Coming soon” toast.

All data is in `lib/data.ts`. Replace with your own state or API when you add persistence.
