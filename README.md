## The Problem
Current AI chatbots are designed for 1-on-1 conversations. But what happens when multiple users want to talk to the same AI simultaneously? Traditional chatbots break down - they don't know when to respond, who to address, or how to maintain coherent group context.

## Our Solution
MultiChat AI is a real-time multiplayer chatroom where multiple users can interact with an AI character named Nomi. The system uses:

- **Smart Turn-Taking**: AI detects @mentions, conversation lulls, and direct questions to decide when to respond
- **Context Management**: Maintains both individual user memories and group conversation summaries
- **Real-Time Streaming**: Responses stream token-by-token to all users simultaneously
- **WebSocket Architecture**: Built with Socket.io for instant message synchronization

## Technologies Used
- **Frontend**: React, Socket.io Client, Vite
- **Backend**: Node.js, Express, Socket.io Server
- **AI**: JanitorAI JLLM API (25k context window)
- **Deployment**: Vercel (frontend), Railway (backend)

## Innovation
Unlike traditional chatbots, our system implements:
1. Dynamic per-room context buffers
2. Multi-user prompting architecture
3. Rate limiting and anti-spam measures
4. Graceful handling of user join/leave events

## Impact
This architecture enables new use cases:
- Virtual study groups with AI tutors
- Collaborative brainstorming sessions
- Customer support where multiple agents and AI assist together
- Educational workshops with AI facilitators

## Try It Live
🔗 https://2man.vercel.app/
