# Voice Setup - LiveKit Official CLI Method

## Fast Track (Recommended by LiveKit)

Instead of the custom Python agent I built, use LiveKit's official CLI for instant setup:

### 1. Install LiveKit CLI

**Windows (PowerShell)**:
```powershell
# Using Scoop (if installed)
scoop install livekit

# OR download directly
curl -sSL https://get.livekit.io/cli | powershell -
```

**Mac/Linux**:
```bash
brew install livekit-cli
# OR
curl -sSL https://get.livekit.io/cli | bash
```

### 2. Authenticate
```bash
lk cloud auth
```

### 3. Create Agent Boilerplate
```bash
lk app create
```

Select:
- Template: **Python Agent** (or any voice agent template)
- Name: `nomi-voice-agent`

### 4. Customize Your Agent

The CLI creates `src/agent.py`. Replace the system prompt with Nomi's personality:

```python
initial_ctx = llm.ChatContext().append(
    role="system",
    text="You are Nomi, a witty AI character in a voice chat room. Keep responses concise (2-3 sentences max for voice). Be friendly, fun, and engaging. Remember user names and context from the conversation.",
)
```

### 5. Run Locally
```bash
cd nomi-voice-agent
uv sync
uv run src/agent.py download-files
uv run src/agent.py console
```

Speak with Nomi in your terminal! 🎤

### 6. Test with Frontend

The backend already has the `/voice/token` endpoint ready. Just update your `.env`:

**Backend `.env`**:
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxx
LIVEKIT_API_SECRET=xxxxxx
```

Get these from: https://cloud.livekit.io → Your Project → Settings → Keys

**Redeem Free Credits**:
https://cloud.livekit.io/projects/p_/redeem → Code: `LIVEKIT-CALHACKS`

### 7. Deploy Agent to Cloud
```bash
cd nomi-voice-agent
lk agent create
```

Done! Your agent runs 24/7 in LiveKit Cloud.

## Alternative: Use My Custom Agent

If you want the custom JLLM integration I built (connects JanitorAI directly to voice):

```bash
cd "c:\Users\mubva\Downloads\janitor ai chat\multiplayer-ai-chat\voice-agent"
copy .env.example .env
# Edit .env with your LiveKit credentials

# Install dependencies
pip install -e .
# OR
uv sync

# Run
python src/agent.py dev
# OR
uv run src/agent.py dev
```

## Which Should You Use?

**LiveKit CLI Method** (Recommended for hackathon):
- ✅ 5 minutes to working voice agent
- ✅ Uses OpenAI GPT-4 (proven, reliable)
- ✅ Official examples and support
- ✅ Deploy with one command

**Custom Agent** (My implementation):
- ✅ Uses JanitorAI JLLM (prize alignment)
- ⚠️ Slightly more complex setup
- ✅ Full control over prompts and logic

**My Recommendation**: Start with the CLI method to get voice working quickly, then swap in the custom JLLM integration if you have time and want to showcase the JanitorAI prize requirement.

## Testing Voice in Frontend

Once your agent is running (either method):

1. Make sure backend has `LIVEKIT_*` env vars
2. Restart backend: `npm run dev`
3. Open frontend: http://localhost:5173
4. Click **🎤 Voice** tab
5. Allow microphone
6. Speak: "Hey Nomi!"
7. Nomi responds with voice ✨

## Troubleshooting

**"Voice not available" error**:
- Check backend `.env` has `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- Restart backend after adding env vars

**No voice response**:
- Make sure agent is running (`lk agent create` or `uv run src/agent.py dev`)
- Check agent logs for errors
- Verify room name matches (default: `global`)

**Microphone permission denied**:
- Use HTTPS in production (Vercel auto-provides this)
- For local dev, allow mic in browser settings

## Next Steps

1. ✅ Get voice working with CLI method (5 min)
2. ✅ Test in frontend
3. ✅ Deploy agent: `lk agent create`
4. ✅ Demo for judges with both chat + voice
5. 🎯 Win LiveKit + ElevenLabs prizes!

---

**Resources**:
- [LiveKit Docs](https://docs.livekit.io/agents/quickstart/)
- [Python Examples](https://github.com/livekit/agents/tree/main/examples)
- [Agent Playground](https://agents-playground.livekit.io/)
