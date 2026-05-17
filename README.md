# 🍕 BulloniPizza

A premium Progressive Web App for a modern pizza brand. Built with **Next.js 14
(App Router)**, **Tailwind CSS**, **shadcn/ui**, **Framer Motion**, **Zustand**,
**Prisma + PostgreSQL**, **next-pwa**, and **Cloudinary**.

> The app works fully out of the box without a database — sample data is bundled
> and orders are persisted in `localStorage`. Set `DATABASE_URL` and run
> migrations to enable the Prisma-backed mode.

## ✨ Features

- 🍕 Beautiful, premium landing page (hero, popular, categories, features,
  delivery, testimonials, CTA, promo banner)
- 📱 Fully responsive with a mobile bottom-nav and a sticky cart button
- 🛒 Cart drawer with free-delivery progress bar, animated quantity controls
- 🎨 **Pizza customization**: size (S/M/L), crust (classic / thin / cheese-stuffed),
  extras — price recalculates live
- ❤️ Favorites (persisted in localStorage)
- 🔍 Menu search & category filter pills
- 📦 Checkout with React Hook Form + Zod validation
- 📦 Order confirmation page with animated multi-step status timeline
- 👨‍💼 Admin dashboard: stats, products, orders
- 🌍 Full i18n: Ukrainian (default), English, Russian — saved to localStorage
- 🌓 Light / Dark / System theme via `next-themes`
- 🎬 Framer Motion animations everywhere
- 📲 PWA: installable, offline page, manifest, service worker via `next-pwa`
- 🔐 Optional Prisma + PostgreSQL with Users / Products / Categories / Orders /
  OrderItems / Favorites / PromoBanner models

## 🚀 Getting started

```bash
pnpm install        # or npm/yarn
cp .env.example .env
pnpm dev
```

Open <http://localhost:3000>.

### With a database

```bash
# 1. set DATABASE_URL in .env
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### PWA icons

Drop `icon-192.png` and `icon-512.png` into `public/icons/`
(SVG source provided).

## 🧱 Tech stack

| | |
|--|--|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS, shadcn/ui patterns |
| Animation | Framer Motion |
| State | Zustand + persist |
| Forms | React Hook Form + Zod |
| Toast | react-hot-toast |
| DB | Prisma + PostgreSQL (optional) |
| Images | Cloudinary (optional) |
| PWA | next-pwa |

## 📂 Structure

```
src/
  app/
    page.tsx            # Landing
    menu/page.tsx       # Catalog with search & filters
    favorites/page.tsx  # Saved items
    checkout/page.tsx   # Order form
    orders/[id]/page.tsx# Live order status
    admin/page.tsx      # Admin dashboard
    delivery/about/offline pages
    api/                # Route handlers
  components/
    ui/                 # Button, Input, Dialog, ...
    layout/             # Header, Footer, MobileNav, switchers
    sections/           # Landing sections
    product/            # Card + customization dialog
    cart/               # Drawer + sticky button
  i18n/                 # uk / en / ru dictionaries + provider
  store/                # cart, favorites
  lib/                  # prisma, utils, pricing, sample-data
prisma/
  schema.prisma         # full schema (users, orders, ...)
  seed.ts               # seed script
public/
  manifest.json
  icons/
```

Enjoy! 🍕
