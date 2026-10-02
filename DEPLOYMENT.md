# 🚀 DIGITAL HEROES — LEVEL 3 DEPLOYMENT GUIDE

## Deployment Infrastructure
- **Frontend SPA**: Vercel (`digital-heroes-green.vercel.app`)
- **Backend API & WebSockets**: Render (`digital-heroes-zutk.onrender.com`)
- **Database**: Render PostgreSQL / SQLite fallback

---

## Build Scripts

### Server (`server/package.json`)
```json
"scripts": {
  "build": "tsc",
  "start": "npm run build && npx prisma db push && node dist/index.js"
}
```

### Client (`client/package.json`)
```json
"scripts": {
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

---

## Environment Variables

### Server Environment (`server/.env`)
- `PORT`: 4000
- `DATABASE_URL`: `file:./dev.db` (Local) / PostgreSQL URI (Production)
- `JWT_SECRET`: Secret JWT key
- `CLIENT_URL`: `https://digital-heroes-green.vercel.app`

### Client Vercel Configuration (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://digital-heroes-zutk.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
