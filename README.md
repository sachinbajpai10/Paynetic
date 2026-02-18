# Paynetic – Global Contractor Payments Portal

A responsive, pixel-perfect dashboard prototype for the Paynetic contractor payments portal. Built with Next.js 14+ (App Router), Tailwind CSS, shadcn/ui, Lucide icons, and Framer Motion.

## Folder structure

```
src/
├── app/
│   ├── globals.css       # Tailwind + Paynetic theme (navy/blue)
│   ├── layout.tsx        # Root layout with GlobalNav
│   └── page.tsx          # Dashboard page
├── components/
│   ├── global-nav.tsx    # Top bar: logo, search, New Invoice+, user (Sarah Doe)
│   ├── contractor-ledger-table.tsx  # “Select Contracts to Pay” table
│   └── ui/               # shadcn: button, card, table, avatar, checkbox
├── data/
│   └── mockData.ts       # Urgent payments, ledger rows, metrics, FX insight
└── lib/
    └── utils.ts          # cn() for class names
```

## Dashboard (Screen 1)

- **Global nav:** Paynetic logo, search bar, prominent “New Invoice +” button, user profile (Sarah Doe, Rochester, NY).
- **Handle Urgent Payments First:** Contractor avatar, name, status (Overdue/Upcoming), Review / Pay Now.
- **Smart FX Insights:** “FX rate trending up!” card with Schedule Now.
- **Metric cards:** Total Spending ($24,000), Payments Pending (12), Payment Review (1), Payments Completed (24).
- **Contractor Ledger:** Table with checkboxes, Contractor (avatar), Invoice Date, Amount, Country, color-coded Status, Review/Pay actions.

Data is driven by `src/data/mockData.ts`. The ledger supports row selection (checkboxes); UI is responsive (mobile and desktop).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
