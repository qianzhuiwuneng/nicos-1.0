# Nicos 1.0

A quiet, reflective container for a year-long becoming journey. Not a productivity app — a place to revisit weekly reflections, monthly patterns, reading notes, and what is surfacing now.

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
| `/`        | Current Chapter / Home — week context, yearly anchor, and A Line for Now |
| `/this-week` | Current program week with weekly reflection + linked reading |
| `/weekly`  | Weekly reflection (theme, best/worst, next micro-adjustments) |
| `/monthly` | Monthly reflection (keywords, worth it / not, next focus) |
| `/reading` | Monthly reading archive with synced weekly reading-note excerpts |
| `/reading/[bookId]` | Full reading-note detail page linked back to weekly reflection |
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
