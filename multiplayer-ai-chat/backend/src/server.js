import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { streamChat } from './api/jllm.js';
import { ContextManager } from './services/contextManager.js';
import { ResponseScheduler } from './services/responseScheduler.js';
import { summarizeRoom } from './services/summarizer.js';
import { AccessToken } from 'livekit-server-sdk';


const app = express();
app.use(express.json());


const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN }));


const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: FRONTEND_ORIGIN },
  pingInterval: 20000,
  pingTimeout: 30000
});


const PORT = process.env.PORT || 3001;


// In-memory per-room state
const context = new ContextManager();
const schedulers = new Map(); // roomId -> ResponseScheduler
const inflight = new Map();   // roomId -> boolean
const scheduled = new Map();  // roomId -> Timeout


// Simple in-memory rate limiter per socket
const rate = new Map(); // socket.id -> timestamps[]
const RATE_LIMIT = { count: 6, windowMs: 5000 };


function ensureScheduler(roomId) {
  if (!schedulers.has(roomId)) {
    schedulers.set(roomId, new ResponseScheduler());
  }
  return schedulers.get(roomId);
}


io.on('connection', socket => {
  socket.data.rooms = new Set();


  socket.on('room:join', ({ roomId, user }) => {
    socket.join(roomId);
    socket.data.user = user || { name: 'Anonymous' };
    socket.data.rooms.add(roomId);
    context.addUserPresence(roomId, socket.data.user.name);
    io.to(roomId).emit('presence:update', { roomId, users: context.listUsers(roomId) });
    io.to(roomId).emit('system', { type: 'join', user: socket.data.user, roomId, ts: Date.now() });
  });


  socket.on('chat:message', async ({ roomId, content }) => {
    // Rate limit
    const now = Date.now();
    const arr = rate.get(socket.id) || [];
    const cutoff = now - RATE_LIMIT.windowMs;
    const recent = arr.filter(t => t > cutoff);
    recent.push(now);
    rate.set(socket.id, recent);
    if (recent.length > RATE_LIMIT.count) {
      socket.emit('system', { type: 'rate_limited', ts: now });
      return;
    }


    const user = socket.data.user || { name: 'User' };
    const messageId = `${socket.id}-${now}-${Math.floor(Math.random()*1e6)}`;
    const msg = { id: messageId, role: 'user', name: user.name, content, ts: now };


    // Broadcast human message first
    io.to(roomId).emit('chat:message', { ...msg });
    context.addUserMessage(roomId, user, content);


    // Scheduler
    const scheduler = ensureScheduler(roomId);
    scheduler.recordHumanMessage();
    if (scheduler.shouldRespond(msg)) {
      scheduleAI(roomId);
    }
  });


  socket.on('message:react', ({ roomId, messageId, emoji }) => {
    if (!roomId || !messageId || !emoji) return;
    const user = socket.data.user || { name: 'User' };
    io.to(roomId).emit('message:react', { roomId, messageId, emoji, user: user.name, ts: Date.now() });
  });


  socket.on('typing', ({ roomId, isTyping }) => {
    const user = socket.data.user || { name: 'User' };
    socket.to(roomId).emit('typing', { roomId, user: user.name, isTyping: !!isTyping });
  });


  socket.on('disconnect', () => {
    // presence updates per room joined
    const name = socket.data.user?.name;
    for (const roomId of socket.data.rooms || []) {
      if (name) {
        context.removeUserPresence(roomId, name);
        io.to(roomId).emit('presence:update', { roomId, users: context.listUsers(roomId) });
      }
      io.to(roomId).emit('system', { type: 'leave', user: socket.data.user, roomId, ts: Date.now() });
    }
    rate.delete(socket.id);
  });
});


function scheduleAI(roomId) {
  if (inflight.get(roomId)) return;
  if (scheduled.get(roomId)) return;
  const t = setTimeout(() => {
    scheduled.delete(roomId);
    if (!inflight.get(roomId)) void handleAIResponse(roomId);
  }, 500);
  scheduled.set(roomId, t);
}


async function handleAIResponse(roomId) {
  inflight.set(roomId, true);
  const requestId = `${roomId}-${Date.now()}`;
  io.to(roomId).emit('ai:started', { roomId, requestId });


  const messages = context.buildMessages(roomId);
  let full = '';


  await streamChat({
    messages,
    onToken: token => {
      full += token;
      io.to(roomId).emit('ai:token', { requestId, text: token });
    },
    onDone: ({ fullText }) => {
      if (fullText && fullText.length) full = fullText;
    },
    onError: err => {
      io.to(roomId).emit('ai:error', { requestId, message: String(err.message || err) });
    }
  });


  // Finalize
  if (full && full.trim()) {
    context.addAssistantMessage(roomId, full);
  }
  io.to(roomId).emit('ai:done', { requestId, fullText: full });


  const scheduler = ensureScheduler(roomId);
  scheduler.markAIResponded();
  inflight.set(roomId, false);


  // Kick off async summarization (non-blocking)
  try {
    const roomState = context.ensureRoom(roomId);
    const summary = await summarizeRoom({ roomId, roomState });
    if (summary) {
      context.setGroupSummary(roomId, summary);
    }
  } catch (e) {
    // ignore summarization errors in MVP
  }
}


// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));


server.listen(PORT, () => {
  console.log(`Backend listening on :${PORT}, CORS origin ${FRONTEND_ORIGIN}`);
});


// LiveKit token route (optional)
app.get('/voice/token', (req, res) => {
  const url = process.env.LIVEKIT_URL;
  const key = process.env.LIVEKIT_API_KEY;
  const secret = process.env.LIVEKIT_API_SECRET;
  if (!url || !key || !secret) {
    return res.status(501).json({ error: 'LiveKit not configured' });
  }
  const { roomId = 'global', identity } = req.query;
  if (!identity) return res.status(400).json({ error: 'identity required' });
  const at = new AccessToken(key, secret, { identity: String(identity) });
  at.addGrant({ roomJoin: true, room: String(roomId) });
  const token = at.toJwt();
  res.json({ url, token });
});


// Graceful shutdown
function shutdown() {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);