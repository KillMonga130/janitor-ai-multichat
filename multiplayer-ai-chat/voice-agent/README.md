# Nomi Voice Agent

LiveKit Python voice agent for multiplayer AI chat.

## Quick Start (Local Console)

1. Copy env:
```bash
cp .env.example .env
```

2. Fill in your LiveKit credentials from [cloud.livekit.io](https://cloud.livekit.io):
   - `LIVEKIT_URL`
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`

3. Install dependencies (requires Python 3.10+):
```bash
# Using uv (recommended)
uv sync
uv run src/agent.py download-files
uv run src/agent.py console

# OR using pip
pip install -e .
python src/agent.py download-files
python src/agent.py console
```

4. Speak with Nomi in your terminal!

## Deploy to LiveKit Cloud

```bash
lk cloud auth
lk agent create
```

Follow prompts to deploy. Your agent will auto-connect when users join voice rooms.

## Frontend Integration

The backend already exposes `GET /voice/token?roomId=global&identity=UserName` which returns:
```json
{
  "url": "wss://...",
  "token": "..."
}
```

Use this with the frontend voice UI (see `../frontend/src/components/VoiceRoom.jsx`).

## Architecture

- **STT**: OpenAI Whisper (speech-to-text)
- **LLM**: JanitorAI JLLM (custom adapter, OpenAI-compatible)
- **TTS**: OpenAI TTS (text-to-speech, "nova" voice)
- **VAD**: Silero Voice Activity Detection

Nomi greets users on join and responds conversationally with short voice-optimized replies.
