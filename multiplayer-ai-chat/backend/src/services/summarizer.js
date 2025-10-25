import { streamChat } from '../api/jllm.js';

// Build a short rolling group summary from recent messages.
export async function summarizeRoom({ roomId, roomState }) {
  const recent = roomState.history.slice(-20);
  const sys = {
    role: 'system',
    content: 'You are an assistant that writes a concise rolling summary (3-6 sentences) of a group chat. Capture topics, decisions, and any user-specific preferences. Be neutral and brief.'
  };
  const prompt = [sys, ...recent, { role: 'user', content: 'Summarize the conversation so far for quick context.' }];
  let full = '';
  await streamChat({
    messages: prompt,
    temperature: 0.3,
    max_tokens: 200,
    onToken: t => { full += t; },
    onDone: () => {}
  });
  return full.trim();
}
