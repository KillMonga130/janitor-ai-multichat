# Deployment Instructions

## Deploy Backend to Railway

### 1. Install Railway CLI
```powershell
npm install -g @railway/cli
```

### 2. Login
```powershell
railway login
```

### 3. Deploy
```powershell
cd "c:\Users\mubva\Downloads\janitor ai chat\multiplayer-ai-chat\backend"
railway init
railway up
```

### 4. Set Environment Variables
In Railway dashboard (opens automatically):
- `JLLM_AUTH` = `calhacks2047`
- `FRONTEND_ORIGIN` = (set after deploying frontend, e.g., `https://your-app.vercel.app`)
- Optional: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` (for voice)

### 5. Copy Your Backend URL
Railway gives you a URL like: `https://your-app.up.railway.app`

---

## Deploy Frontend to Vercel

### 1. Install Vercel CLI
```powershell
npm install -g vercel
```

### 2. Deploy
```powershell
cd "c:\Users\mubva\Downloads\janitor ai chat\multiplayer-ai-chat\frontend"
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Scope: (your account)
- Link to existing project? **N**
- Project name: `multiplayer-ai-chat` (or whatever you want)
- Directory: `.` (current)
- Override settings? **N**

### 3. Set Environment Variable
```powershell
vercel env add VITE_SOCKET_URL
```

Enter your Railway backend URL: `https://your-app.up.railway.app`

Environment: **Production**

### 4. Redeploy with Env Var
```powershell
vercel --prod
```

### 5. Copy Your Frontend URL
Vercel gives you: `https://your-app.vercel.app`

### 6. Update Backend CORS
Go to Railway dashboard → your project → Variables:
- Set `FRONTEND_ORIGIN` = `https://your-app.vercel.app`
- Redeploy (or it auto-redeploys)

---

## Alternative: Deploy with GitHub

### Backend (Railway)
1. Push code to GitHub
2. Go to railway.app
3. "New Project" → "Deploy from GitHub"
4. Select your repo → `backend` folder
5. Set env vars in dashboard

### Frontend (Vercel)
1. Push code to GitHub
2. Go to vercel.com
3. "New Project" → Import from GitHub
4. Select your repo → Root directory: `frontend`
5. Add env var: `VITE_SOCKET_URL`
6. Deploy

---

## Test Deployment

1. Visit your Vercel URL
2. Open in 2 browser tabs
3. Chat between tabs
4. @Nomi should respond
5. Check Railway logs if issues

---

## Deploy Voice Agent (Optional)

### Using LiveKit CLI
```powershell
cd "c:\Users\mubva\Downloads\janitor ai chat\multiplayer-ai-chat\voice-agent"

# Or if you used lk app create:
cd your_agent_directory

lk cloud auth
lk agent create
```

Follow prompts. Agent deploys to LiveKit Cloud and auto-connects to rooms.

---

## Quick Deploy Summary

**Fastest path**:
1. `railway login` + `railway up` (backend)
2. Copy Railway URL
3. `vercel` + add `VITE_SOCKET_URL` env (frontend)
4. Update `FRONTEND_ORIGIN` in Railway
5. Done! ✅

**Time**: ~10 minutes total

**Cost**: Free tier for both (Railway $5 trial credit, Vercel free)
