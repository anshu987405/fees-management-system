# Student Fees Management System

A production-ready full-stack SaaS-style Student Fees Management System with React, Tailwind CSS, Express, MongoDB, JWT auth, Excel import/export, WhatsApp reminders, UPI QR generation, receipt support, payment verification, analytics, and a clean MVC backend.

## Structure

```text
client/   React + Vite + Tailwind frontend
server/   Express + MongoDB + Mongoose backend
```

## Quick Start

1. Copy environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Install dependencies:

```bash
npm run install:all
```

3. Start MongoDB. If you do not have MongoDB installed locally, use Docker:

```bash
docker compose up -d
```

4. For a fresh demo database only, seed sample data:

```bash
ALLOW_DESTRUCTIVE_SEED=true npm run seed
```

On Windows PowerShell:

```powershell
$env:ALLOW_DESTRUCTIVE_SEED='true'; npm run seed
```

5. Start development:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000/api`

## Offline / Local Usage

This project can run fully on a local machine or local institute network after dependencies are installed once.

Requirements for offline use:

- Node.js installed
- MongoDB installed and running locally, or Docker with the Mongo image already available
- Dependencies already installed in `client/node_modules` and `server/node_modules`

Windows quick start after setup:

```bat
start-offline.bat
```

`start-offline.bat` is safe for daily use. It auto-checks environment files, dependencies, MongoDB, admin/settings, backend, and frontend. It does not delete student, fee, payment, or report records.

If login ever fails, run:

```bat
reset-login.bat
```

Then login with:

```text
admin@feespro.local
Admin@12345
```

Manual offline start:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

Use this URL on the same computer:

```text
http://localhost:5173
```

For another device on the same Wi-Fi/LAN, replace `localhost` with the computer IP address, for example:

```text
http://192.168.1.10:5173
```

The frontend automatically calls the backend on the same IP address, so it works better when moved to another computer or opened from another LAN device.

For access from any phone without IP address, deploy the app online and set:

```text
Settings -> Public App URL
```

See [CLOUD-DEPLOYMENT.md](./CLOUD-DEPLOYMENT.md).

Offline limitations:

- WhatsApp reminders use `wa.me`, so sending messages needs internet.
- Razorpay/Stripe style live verification needs internet.
- Cash, UPI record keeping, student management, reports, Excel import/export, QR generation, and receipt records work locally.

## Keeping Records Safe

Saved records live in MongoDB, not in the browser. If you use the included Docker setup, records are stored in the persistent Docker volume named `create-a-production-ready-full-stack_mongo-data`. Closing the app or restarting the computer will not delete records.

Daily backup:

```bat
backup-db.bat
```

Restore from backup:

```bat
restore-db.bat
```

Important:

- Use `start-offline.bat` for normal daily startup.
- Do not run `npm run seed` on a live database, because the seed command resets demo data.
- Keep backup files from the `backups/` folder on another drive or pen drive for extra safety.

## Default Login

```text
Email: admin@feespro.local
Password: Admin@12345
```

Change this immediately in production.

## Core Features

- Secure JWT admin authentication
- Dashboard analytics and monthly revenue charts
- Student CRUD, profile pages, search, filters, pagination
- Fee payments with partial payments and history
- Printable fee slip / receipt generation with maintained receipt records
- WhatsApp fee slip sharing with receipt details and secure receipt link
- Student payment/upload QR generation from the Students table with download, print, and WhatsApp actions
- Student payment proof upload after QR payment, creating admin approval requests
- Excel import/export for students and reports
- WhatsApp pending-fee reminders via `wa.me`
- UPI QR generation per student and amount
- Payment screenshot upload with approve/reject workflow
- Settings for UPI ID, institute profile, dark mode-ready UI
- Future-ready roles and clean MVC architecture

## Production Notes

- Set strong `JWT_SECRET`, `COOKIE_SECRET`, and MongoDB credentials.
- Use HTTPS and a reverse proxy in production.
- Serve uploads from object storage for large deployments.
- Configure `CLIENT_URL` to your deployed frontend origin.
- Add a real payment gateway webhook if enabling Razorpay/Stripe.
