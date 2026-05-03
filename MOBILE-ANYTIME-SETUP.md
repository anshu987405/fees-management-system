# Mobile Anytime Setup

If you want to use FeesPro from your phone even when the laptop is closed, the app must run on an always-on server. A phone cannot access a backend/database that is switched off.

## Best Options

### Option 1: Use On The Same Wi-Fi

Use this when the laptop/PC is on.

1. Double-click `start-offline.bat`.
2. Find the PC IP address:

```powershell
ipconfig
```

3. On phone browser, open:

```text
http://PC_IP_ADDRESS:5173
```

Example:

```text
http://192.168.1.10:5173
```

This works only while the PC is on and connected to the same Wi-Fi.

### Option 2: Use Anytime From Phone

Use this when you want access without keeping the laptop open.

You need:

- A cloud/VPS server or hosting service
- MongoDB Atlas or a MongoDB server
- A domain name or public URL

Recommended simple deployment:

1. Create MongoDB Atlas free cluster.
2. Set `MONGO_URI` in `server/.env` to the Atlas connection string.
3. Build frontend:

```bash
npm run build
```

4. Start server:

```bash
npm start
```

In production, the Express server serves both:

- Frontend website
- Backend API

So the phone can open one URL, for example:

```text
https://your-feespro-domain.com
```

## Data Safety

Permanent data is stored in MongoDB. It is not stored in the browser.

To avoid data loss:

- Use `start-offline.bat` for daily local use.
- Do not run destructive seed on real data.
- Run `backup-db.bat` regularly.
- For phone-anytime use, prefer MongoDB Atlas automated backups.

## QR Payment

Set UPI ID from:

```text
Settings -> UPI ID
```

Then use:

```text
Students -> QR button
```

QR can be downloaded, printed, or sent through WhatsApp.

The admin QR is a payment/upload page QR. When the student scans it, a page opens with:

- UPI QR
- Pay Now With UPI button
- Screenshot/UTR upload form

After student pays through QR, they can open the proof-upload link and upload the payment screenshot. The payment appears in:

```text
Payments -> Verification Pending
```

Admin can then approve or reject it.
