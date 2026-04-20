# Steps Tracker

A simple, beautiful step tracker published on GitHub Pages.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh)
- **Framework:** [Next.js](https://nextjs.org) (static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui

## How to Track Steps

1. Edit `data/steps.json` — add or update an entry with the date and whether the goal was completed.
2. Open a Pull Request with your changes.
3. Once merged, the site is automatically redeployed via GitHub Pages.

## Run Locally

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Privacy

Only step completion data is stored — a date and a boolean indicating whether the daily goal was met. No personal health information, location data, or identifying details are collected.
