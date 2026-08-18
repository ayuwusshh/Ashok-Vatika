# Deployment Guide

This project is best deployed as two services:

- Backend: Render
- Frontend: Vercel

## Backend on Render

Create a new Render Web Service from this repository.

Use these settings:

```text
Root Directory: Backend
Build Command: npm install
Start Command: npm start
Environment: Node
```

Required environment variables:

```text
NODE_ENV=production
MONGODB_URI=<your MongoDB Atlas connection string>
CLERK_SECRET_KEY=<your Clerk secret key>
CLERK_PUBLISHABLE_KEY=<your Clerk publishable key>
PERENUAL_API_KEY=<your Perenual API key>
```

Optional environment variable:

```text
REDIS_URL=<your hosted Redis URL>
```

If `REDIS_URL` is not set in production, the backend now starts with caching disabled and calls Perenual directly.

After deployment, your backend URL will look like:

```text
https://ashok-vatika-backend.onrender.com
```

Test it:

```text
https://ashok-vatika-backend.onrender.com/
```

Expected response:

```text
Ashok Vatika 2.0 API is running...
```

## Frontend on Vercel

Create a new Vercel project from this repository.

Use these settings:

```text
Root Directory: Frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Required environment variables:

```text
VITE_CLERK_PUBLISHABLE_KEY=<your Clerk publishable key>
VITE_API_URL=<your Render backend URL>
```

Example:

```text
VITE_API_URL=https://ashok-vatika-backend.onrender.com
```

## Clerk Settings

In Clerk, add your Vercel frontend domain to the allowed origins/redirect URLs.

Use the same publishable key in:

```text
Backend: CLERK_PUBLISHABLE_KEY
Frontend: VITE_CLERK_PUBLISHABLE_KEY
```

Never put `CLERK_SECRET_KEY` in the frontend.

## Notes

The analyzer uses Tesseract OCR, which can be CPU-heavy. Render is a better fit for this backend than Vercel serverless because it runs as a normal Node web service.
