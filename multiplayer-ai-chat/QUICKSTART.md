# Quick Start Guide

## 1. Backend Setup (5 min)

```powershell
cd "c:\Users\mubva\Downloads\janitor ai chat\multiplayer-ai-chat\backend"
copy .env.example .env
npm install
npm run dev
```

Expected: "Backend listening on :3001"

## 2. Frontend Setup (3 min)

```powershell
cd "c:\Users\mubva\Downloads\janitor ai chat\multiplayer-ai-chat\frontend"
copy .env.example .env
npm install
npm run dev
```

Visit http://localhost:5173

## 3. Test Chat (2 min)

- Open 2 browser tabs → http://localhost:5173
- Send messages between tabs
- Type `@Nomi hello` to trigger AI response
- See AI stream tokens live
- Try reactions (👍 😂 ❤️)

## 4. Voice (Optional - 10 min)

### Get LiveKit Credentials
1. Sign up at https://cloud.livekit.io
2. Create a project
3. Redeem promo: https://cloud.livekit.io/projects/p_/redeem → `LIVEKIT-CALHACKS`
4. Copy: URL, API Key, API Secret

### Update Backend
Edit `backend\.env`:
```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxx
LIVEKIT_API_SECRET=xxx
```

Restart backend: `npm run dev`

### Start Voice Agent
```powershell
cd "c:\Users\mubva\Downloads\janitor ai chat\multiplayer-ai-chat\voice-agent"
copy .env.example .env
# Edit .env with same LiveKit credentials + JLLM_AUTH=calhacks2047

# Install uv (Python package manager)
# Or use pip: pip install -e .

uv sync
uv run src/agent.py download-files
uv run src/agent.py dev
```

### Test Voice
- Frontend → Click 🎤 Voice tab
- Allow microphone
- Speak "Hey Nomi!"
- AI responds with voice

## Deploy (20 min)

### Vercel (Frontend)
```powershell
cd frontend
npm install -g vercel
vercel
```
Set env: `VITE_SOCKET_URL=https://YOUR-BACKEND.up.railway.app`

### Railway (Backend)
```powershell
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```
Set envs in Railway dashboard: `FRONTEND_ORIGIN`, `LIVEKIT_*`

### LiveKit Cloud (Voice Agent)
```powershell
cd voice-agent
brew install livekit-cli  # or: curl -sSL https://get.livekit.io/cli | bash
lk cloud auth
lk agent create
```

Done! 🎉
