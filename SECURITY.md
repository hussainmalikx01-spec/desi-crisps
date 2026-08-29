# Security Overview — Desi Crisps

Plain-language summary of the protections built into this site. Written for a non-technical owner.

## Admin login protection
- Passwords are never stored as plain text — they're scrambled with **bcrypt**, a one-way hashing algorithm. Even if the database were ever exposed, no one could read the actual passwords.
- After **5 failed login attempts**, the account locks for 15 minutes. This stops someone from guessing your password by brute force.
- Login sessions use secure, HTTP-only cookies, meaning malicious scripts on the page cannot steal your session even if one somehow got injected.

## Admin panel protection
- Every page under `/admin` checks — on the server, not just in the browser — that you're logged in before showing anything. A visitor cannot bypass this by editing the page in their browser.
- All actions that change data (edit a product, update an order, change settings) require a valid, verified session.

## Form & data protection
- Every form (checkout, contact, reviews, product editor) validates data on the server, not just the browser. This blocks malformed or malicious input even if someone bypasses the website's own form and sends data directly.
- All database queries go through Prisma, which automatically protects against SQL injection — a common attack where malicious code is snuck into a form field to manipulate the database.
- Anything a customer submits that later gets displayed publicly (like a review comment) is rendered safely by React, which automatically prevents it from being interpreted as executable code (XSS protection).

## Abuse & spam prevention
- Login, checkout, contact form, and review submission are all **rate-limited** — if the same visitor tries too many times in a short window, they're temporarily blocked. This prevents bots from spamming your site or hammering the login form.

## File upload protection
- Only image files (JPG, PNG, WEBP) under 5MB can be uploaded through the admin panel.
- Uploaded images are processed through Cloudinary, which strips hidden metadata and re-encodes the file — this closes off a common trick where a malicious file is disguised as an image.

## Network-level protection
- Security headers are automatically added to every page: they prevent the site from being embedded in a hidden frame on another site (clickjacking protection), stop browsers from misinterpreting file types, and enforce secure HTTPS connections.

## Accountability
- Every admin action (editing a product, changing an order status, updating settings) is logged with who did it and when, in an internal audit log — useful if you ever need to trace back a change.

## What you should still do
- Keep your `.env` file and any API keys **private** — never share them or commit them to a public GitHub repository.
- Use a strong, unique password for your admin account (change the default immediately — see README.md Section 4).
- If you ever suspect your admin account is compromised, change your password immediately via Admin → Admin Users.
