# Cloud Deployment For Any Phone Access

To use FeesPro from any phone without IP address, the app must run on a public server/domain.

Local laptop mode cannot do this when the laptop is closed or when the student is outside your Wi-Fi.

## What You Need

- Public app hosting URL, for example:

```text
https://fees.yourinstitute.com
```

- MongoDB Atlas database or a server MongoDB database
- Server environment variables

## Environment Variables

Set these on your hosting platform:

```text
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER/student-fees-management
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
COOKIE_SECRET=use-another-long-random-secret
CLIENT_URL=https://fees.yourinstitute.com
PUBLIC_APP_URL=https://fees.yourinstitute.com
DEFAULT_UPI_ID=yourupi@upi
UPLOAD_DIR=uploads
```

## Build And Start

```bash
npm run install:all
npm run build
npm start
```

The Express server will serve:

- Frontend app
- Backend API
- Public student payment/upload page
- Public receipt pages

## After Deployment

Login as admin and set:

```text
Settings -> Public App URL
```

Example:

```text
https://fees.yourinstitute.com
```

Then QR and WhatsApp links will work from any phone with internet.

## Payment Approval Flow

1. Admin opens `Students`.
2. Clicks `QR`.
3. Sends WhatsApp link or shows/downloads QR.
4. Student opens link from any phone.
5. Student pays by UPI and uploads screenshot/UTR.
6. Admin receives request in `Payments` as `Verification Pending`.
7. Admin approves or rejects.

## Important WhatsApp Limitation

WhatsApp click-to-chat can send clickable text links automatically. It cannot automatically attach a generated QR image without using the WhatsApp Business API.

This app sends a clickable payment/upload link. The opened page contains the QR, UPI pay button, and upload form.
