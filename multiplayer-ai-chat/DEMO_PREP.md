# Deployment Checklist

## Prize Strategy: Stack Multiple Awards

Target prizes and features needed:

### 1. JanitorAI - Most Functional, Novel, and Fun ✅
**Prize**: AirPods Max per team member

**What to demo**:
- Multi-user chat with streaming AI responses
- Real-time presence and typing indicators
- Smart AI turn-taking (@mentions, timing, questions)
- Message reactions and mood detection

### 2. LiveKit - Most Creative ✅
**Prize**: AirPod Pro with engraved case ($1,500 value)

**What to demo**:
- Voice chat with Nomi AI character
- Python agent with custom JLLM integration
- Seamless text ↔ voice switching

**Setup required**:
- Deploy voice agent to LiveKit Cloud
- Show voice interaction in demo

### 3. Creao - Best Use of Creao 🔄
**Prize**: $4,000 cash

**What to do**:
1. Register at Creao platform
2. Package your multi-user context manager as API
3. Document your novel prompting strategy:
   - Per-room rolling history
   - Auto-summarization
   - User memory tracking
   - Smart response scheduling

### 4. MLH ElevenLabs - Best Voice AI ✅
**Prize**: Airpods 4

**What to demo**:
- Voice agent with natural conversation
- LiveKit integration
- Multi-user voice rooms

### 5. Cal Hacks - Most Creative Overall ✅
**Prize**: iPad + Apple Pencil

**What to demo**:
- Unique multiplayer AI interaction
- Technical innovation (streaming, context management)
- Fun and engaging UX

## Pre-Demo Checklist

### Technical Setup (Day Before)
- [ ] Deploy frontend to Vercel (test URL works)
- [ ] Deploy backend to Railway (test WebSocket connection)
- [ ] Deploy voice agent to LiveKit Cloud
- [ ] Test full flow: chat → AI response → voice switch → AI voice
- [ ] Prepare 2-3 demo accounts/tabs
- [ ] Screenshot/record backup demo video

### Demo Script (2-3 minutes)
1. **Open** (15s): "Multiplayer AI chat where everyone talks to the same AI"
2. **Chat Demo** (45s):
   - Show 2 users chatting
   - @Nomi mention → live streaming response
   - React to messages, show typing
3. **Voice Demo** (45s):
   - Click voice tab
   - Speak to Nomi
   - Show AI voice response
4. **Technical Highlight** (30s):
   - "Custom JLLM integration"
   - "Smart context management with auto-summarization"
   - "Real-time WebSocket + LiveKit voice pipeline"
5. **Close** (15s): Mention prize alignment (voice AI, multiplayer innovation)

### Judge Questions Prep
**"How does the AI handle multiple users?"**
→ "Per-room context with rolling summary, smart response timing based on @mentions, message count, and silence detection"

**"What makes the voice integration creative?"**
→ "Custom adapter bridges JanitorAI JLLM to LiveKit's Python agents—not just OpenAI. Seamless text/voice switching in same character."

**"How would this scale?"**
→ "Single instance MVP works for 10-20 users. Add Redis adapter for Socket.io + move context to Redis for horizontal scaling."

**"What was hardest?"**
→ "SSE streaming from JLLM + syncing streamed tokens across WebSocket clients while maintaining conversation coherence"

## Post-Judging Actions

### If Selected for Final Round
- Polish any rough edges judges noted
- Add one "wow" feature if time permits:
  - Voice room with 3+ simultaneous speakers
  - AI-generated conversation highlights
  - Sentiment visualization

### Creao Submission
1. Go to Creao platform
2. Register your API endpoint
3. Upload:
   - API schema (events + context manager)
   - Sample multi-user prompt strategy
   - Technical documentation

### Networking
- Talk to LiveKit booth → mention your agent
- Railway/Render sponsors → feedback on deployment
- Other teams → collaboration opportunities

## Backup Plans

**If voice breaks during demo**:
→ Focus on chat features, mention "voice works locally, debugging cloud deployment"

**If internet/servers down**:
→ Use pre-recorded video, explain architecture live

**If judges skip your table**:
→ Flag them down: "We built multiplayer voice AI with custom JLLM integration"

## Prize Claim Process

**After winning**:
1. Follow judge instructions for prize claim
2. Provide team member info
3. Submit required forms
4. Post on social media (tag sponsors for bonus points)

Total Potential: **$7,000+ in prizes** 🎯

Good luck! 🚀
