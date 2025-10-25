Multiplayer AI Chat – Hackathon MVP

This workspace contains a working MVP scaffold for a real-time, multi-user AI chat experience using:

- Backend: Node.js + Express + Socket.io (WebSockets) with streaming to JanitorAI (OpenAI-compatible) endpoint
- Frontend: React (Vite) + Socket.io client
- Hosting-ready for: Vercel (frontend) + Railway/Render (backend)

Quick start (dev):

1) Backend
- Copy `multiplayer-ai-chat/backend/.env.example` to `.env`
- Update `JLLM_AUTH` if needed (hackathon header defaults to calhacks2047)
- Install deps and run dev server on port 3001

2) Frontend
- Copy `multiplayer-ai-chat/frontend/.env.example` to `.env`
- Point `VITE_SOCKET_URL` at your backend (e.g., `http://localhost:3001`)
- Install deps and run Vite dev server

Deploy targets:
- Frontend: Vercel
- Backend: Railway or Render (keep single instance for MVP)

See `multiplayer-ai-chat/README.md` for more details.
