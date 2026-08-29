# Desi Crisps — Website Setup Guide

This guide assumes you are **not** a developer. Follow it top to bottom, in order.

---

## 1. What you need before starting

- A computer with [VS Code](https://code.visualstudio.com/) installed
- [Node.js](https://nodejs.org/) installed (choose the "LTS" version)
- A free [GitHub](https://github.com) account (to store your code)
- A free [Vercel](https://vercel.com) account (to host the live site)
- A free database from [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- A free [Cloudinary](https://cloudinary.com) account (for product image uploads)
- Optional: a [Resend](https://resend.com) account (email notifications) and a [WhatsApp Business](https://developers.facebook.com/docs/whatsapp/cloud-api) setup (WhatsApp notifications)

---

## 2. Running the project on your own computer

1. Open the `desi-crisps` folder in VS Code.
2. Open a terminal inside VS Code (menu: Terminal → New Terminal).
3. Type this and press Enter — it installs everything the project needs:
   ```
   npm install
   ```
4. Copy the file `.env.example` and rename the copy to `.env` (same folder). This is where all your secret keys and settings live.
5. Fill in the values inside `.env` — see Section 3 below for where to get each one.
6. Set up your database tables:
   ```
   npx prisma migrate dev --name init
   ```
7. Add the starting products and your admin login:
   ```
   npx prisma db seed
   ```
   This creates your 6 products and one admin account. The terminal will print the admin email and password it just created — write it down.
8. Start the website:
   ```
   npm run dev
   ```
9. Open your browser to **http://localhost:3000** — your site is now running locally.

---

## 3. Where to get each `.env` value

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | From Neon or Supabase, after creating a free project — look for "Connection String" |
| `AUTH_SECRET` | Run `openssl rand -base64 32` in your terminal, paste the output |
| `NEXTAUTH_URL` | `http://localhost:3000` while testing locally; your real domain once live |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary Dashboard homepage after signup |
| `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | Meta for Developers → your WhatsApp Business app |
| `WHATSAPP_ADMIN_NUMBER` | Your own business WhatsApp number, with country code (e.g. `+923001234567`) |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `NOTIFICATION_FROM_EMAIL` / `NOTIFICATION_ADMIN_EMAIL` | Any email you control (from must be verified in Resend) |

---

## 4. Logging into the Admin Panel for the first time

1. Go to `http://localhost:3000/admin/login` (or `yourdomain.com/admin/login` once live).
2. Use the email/password the seed script printed in Section 2, step 7.
3. **Immediately go to Admin → Admin Users → Change Your Password** and set a real password only you know.

---

## 5. Everyday tasks (no code needed)

### Add or replace a product photo
Admin Panel → Products → click a product → scroll to "Product Images" → click **+ Add** to upload, or the trash icon to remove one → **Save Changes**.

### Replace the logo
Admin Panel → Site Settings → click **Replace Logo** → upload your file → **Save Settings**. This updates the logo everywhere on the site automatically (header, favicon reference, About page).

### Update your phone number, WhatsApp, or social links
Admin Panel → Site Settings → edit the relevant field → **Save Settings**.

### Turn on the Nimko product line
Admin Panel → Products → Add Product → set "Product Line" to **Nimko** and "Status" to **Published**. It will automatically appear under the Nimko tab on the Shop page — no code changes needed.

### Approve or reject a customer review
Admin Panel → Reviews → click the check (approve) or X (reject) icon next to any review.

### Change an order's status
Admin Panel → Orders → click an order → change the status dropdown. The customer is automatically notified by WhatsApp when you do this.

---

## 6. How order notifications work

When a customer places an order:
1. It's saved to your database instantly.
2. You get a WhatsApp message (if `WHATSAPP_*` variables are set) and an email (if `RESEND_*` variables are set) with the order details.
3. As you update the order's status in the Admin Panel, the **customer** gets a WhatsApp update automatically (e.g. "Your order is on its way!").

**If your WhatsApp Business number ever changes:** update `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ADMIN_NUMBER` in your `.env` file (or in Vercel's environment variables if already live) — no code changes needed.

---

## 7. Deploying to a live domain (Vercel + database)

1. Push your project to a GitHub repository (VS Code has a built-in "Publish to GitHub" button in the Source Control tab).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repository.
3. When Vercel asks for environment variables, copy in everything from your `.env` file (same names, same values) — except set `NEXTAUTH_URL` to your real domain once you know it (e.g. `https://desicrisps.pk`).
4. Click **Deploy**. Vercel will build and host your site automatically.
5. Once deployed, run the database setup against your **live** database (from your terminal, with `DATABASE_URL` pointed at the live database):
   ```
   npx prisma migrate deploy
   npx prisma db seed
   ```
6. **Connecting your own domain (e.g. desicrisps.pk):**
   - In your Vercel project → Settings → Domains → add your domain name.
   - Vercel will show you 1–2 DNS records (usually an "A" record and/or "CNAME").
   - Log into wherever you bought your domain (e.g. GoDaddy, Namecheap) → find "DNS Settings" → add the records Vercel showed you.
   - Wait 10 minutes to a few hours for DNS to update — then your domain will point to your live site.

---

## 8. Project structure (for future reference)

```
desi-crisps/
├── app/(public)/        → all customer-facing pages
├── app/admin/           → the admin panel
├── app/api/             → backend logic (orders, products, etc.)
├── components/          → reusable UI pieces
├── lib/                 → business logic (payments, notifications, security)
├── prisma/schema.prisma → the database structure
└── public/assets/       → logo and illustration files (swap these anytime)
```

See `SECURITY.md` for a summary of the security measures already built in.

---

## 9. Seeing your traffic (visitor analytics)

The site includes **Vercel Analytics** — real visitor tracking, built in, free on Vercel's Hobby plan. No setup needed: once deployed, go to your Vercel dashboard → your project → **Analytics** tab. You'll see page views, visitor counts, top pages, and traffic sources within a day of going live.

For **sales tracking** specifically (orders, revenue, best-selling products), that's already built into your own Admin Panel: **Admin → Dashboard** shows total orders, pending orders, revenue, and top products — pulled live from your database, not a third-party service.

If you later want deeper marketing analytics (e.g. tracking which Instagram post drove a sale), that requires connecting Google Analytics — let me know and I'll wire it in (you'd just need to create a free Google Analytics account and give me the Measurement ID).

---

## 10. Ongoing maintenance — what "keeping the site running" actually looks like

You don't need to touch code for day-to-day running of the store. Routine maintenance is:

- **Weekly:** Check Admin → Orders for anything stuck in "Pending", check Admin → Reviews for new submissions to approve/reject.
- **As needed:** Update prices, stock, or add products via Admin → Products — no developer required.
- **Occasionally (every few months):** Dependency updates. Run `npm outdated` in the project folder to see what's aged; most updates are safe to apply with `npm update`. Major version jumps (e.g. Next.js 16 → 17) are riskier — test locally before deploying, or come back here for help.
- **If something breaks after a change:** the error message from `npm run dev` or the Vercel deployment log almost always tells you exactly which file and line — paste it here and it can be diagnosed precisely, the same way every issue in this project has been fixed so far.

There's no separate "maintenance system" to install — the admin panel *is* the maintenance system for content/orders, and this README + your build/deploy logs are the maintenance system for the code itself.
