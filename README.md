# Personal Finance Tracker

A client-side web app for tracking income and expenses. Browse a monthly dashboard, manage a transaction ledger, and organize custom categories — all stored in the browser.

Data never leaves your device. There is no backend or account system.

## Features

- **Dashboard** — Month picker with income, expenses, net, and savings rate. Bar chart for monthly income vs expense, pie chart for expense categories, and a recent-activity list.
- **Transactions** — Add, edit, and delete income or expense entries. Filter by type, category, date range, and description; sort by date, amount, or description.
- **Categories** — Default income and expense categories plus custom ones (name, color, icon). Categories in use cannot be deleted.
- **Demo ledger** — First visit seeds sample transactions so charts and lists are populated. A banner lets you clear the sample data without removing anything you added.
- **Light / dark theme** — Preference is saved locally.
- **Responsive layout** — Sidebar on desktop, bottom navigation on small screens.

## Tech stack

- React 19 and TypeScript
- Vite
- React Router
- Tailwind CSS
- Recharts
- React Hook Form, Zod, and `@hookform/resolvers`
- date-fns, lucide-react, uuid

State lives in React context. Persistence uses `localStorage`.

## Getting started

Requires [Node.js](https://nodejs.org/) 20 or later.

```bash
git clone https://github.com/portfolio-projects-ajay-parhar/personal-finance-tracker.git
cd personal-finance-tracker
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build      # production build
npm run preview    # serve the production build
npm run lint
npm run format     # Prettier
```

## How data is stored

Keys in `localStorage`:

| Key | Purpose |
| --- | --- |
| `finance_tracker_transactions` | Transaction list |
| `finance_tracker_categories` | Category list |
| `finance_tracker_theme` | Light or dark |
| `finance_tracker_sidebar_collapsed` | Sidebar state |
| `finance_tracker_mock_seeded` | Whether demo transactions have already been seeded |

Clearing site data for this origin removes everything. Clearing sample data from the banner only removes seeded demo transactions.

## Project layout

```
src/
  pages/           Dashboard, Transactions, Categories
  components/      Layout, charts, modals
  context/         Theme, categories, transactions
  data/            Default categories, icons, mock ledger
  utils/           Storage, filters, formatters, dashboard stats
  types/           Shared TypeScript types
```

## License

Private / personal project. Not licensed for reuse unless you add a license file.
