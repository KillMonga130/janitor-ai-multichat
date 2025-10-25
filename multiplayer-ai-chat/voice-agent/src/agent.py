"""
Nomi Voice Agent - multiplayer AI chat with voice
Uses LiveKit Agents framework with custom JLLM integration
"""
import asyncio
import logging
import os
from typing import Annotated

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import openai, silero

load_dotenv()
logger = logging.getLogger("nomi-voice")
logger.setLevel(logging.INFO)


class NomiLLM(llm.LLM):
    """Custom LLM adapter for JanitorAI JLLM endpoint (OpenAI-compatible)"""

    def __init__(self):
        super().__init__()
        self.auth = os.getenv("JLLM_AUTH", "calhacks2047")
        self.url = "https://janitorai.com/hackathon/completions"

    async def chat(
        self,
        *,
        chat_ctx: llm.ChatContext,
        fnc_ctx: llm.FunctionContext | None = None,
        temperature: float | None = None,
        n: int | None = None,
    ) -> "llm.LLMStream":
        """Use OpenAI plugin with custom base URL and auth"""
        # Use OpenAI plugin with custom endpoint
        custom_client = openai.LLM(
            base_url=self.url,
            api_key=self.auth,
            model="default",  # JLLM uses a single model
        )
        return await custom_client.chat(
            chat_ctx=chat_ctx,
            fnc_ctx=fnc_ctx,
            temperature=temperature or 0.8,
            n=n,
        )


def prewarm(proc: JobProcess):
    """Prewarm TTS and VAD models"""
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    """Main agent entry point"""
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Create Nomi's personality
    initial_ctx = llm.ChatContext().append(
        role="system",
        text="You are Nomi, a witty AI character in a voice chat room. Keep responses concise (2-3 sentences max for voice). Be friendly, fun, and engaging. Remember user names and context from the conversation.",
    )

    # Voice pipeline with custom JLLM
    assistant = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=openai.STT(),  # Use OpenAI Whisper for STT
        llm=NomiLLM(),
        tts=openai.TTS(voice="nova"),  # Nomi's voice
        chat_ctx=initial_ctx,
    )

    # Start the assistant
    assistant.start(ctx.room)

    # Greet users when they join
    await asyncio.sleep(1)
    await assistant.say("Hey everyone! Nomi here. Ready to chat?", allow_interruptions=True)

    logger.info("Nomi voice agent ready")


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
