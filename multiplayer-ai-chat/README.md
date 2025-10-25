Multiplayer AI Chat – MVP

Stack
- Backend: Express + Socket.io + streaming to JanitorAI JLLM (OpenAI chat completions compatible)
- Frontend: React (Vite) + Socket.io client

Run locally
Backend
1. Copy `backend/.env.example` to `backend/.env` and adjust values if needed
2. From `backend/`, install deps and run dev server (port defaults to 3001)

Frontend
1. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_SOCKET_URL` to your backend URL (e.g., http://localhost:3001)
2. From `frontend/`, install deps and run Vite dev server

Environments
- Backend env: `PORT`, `JLLM_AUTH`, `FRONTEND_ORIGIN` (CORS), `NODE_ENV`
- Frontend env: `VITE_SOCKET_URL`

Deploy
- Frontend → Vercel (set `VITE_SOCKET_URL` to your backend URL)
- Backend → Railway/Render (single instance for MVP; set `FRONTEND_ORIGIN` to your Vercel domain)
