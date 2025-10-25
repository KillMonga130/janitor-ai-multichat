import { fetch } from 'undici';
import { createParser } from 'eventsource-parser';

const JLLM_URL = 'https://janitorai.com/hackathon/completions';

// Streams OpenAI-compatible SSE completions and invokes callbacks.
// onToken(text), onDone({ fullText, finishReason }), onError(err)
export async function streamChat({ messages, temperature = 0.8, max_tokens = 500, signal, onToken, onDone, onError }) {
  const headers = {
    Authorization: process.env.JLLM_AUTH || 'calhacks2047',
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    messages,
    temperature,
    max_tokens,
    stream: true
  });

  let fullText = '';

  try {
    const res = await fetch(JLLM_URL, { method: 'POST', headers, body, signal });
    if (!res.ok || !res.body) {
      const text = await res.text();
      throw new Error(`JLLM error ${res.status}: ${text}`);
    }

    const parser = createParser(event => {
      if (event.type !== 'event') return;
      const data = event.data;
      if (!data || data === '[DONE]') {
        onDone?.({ fullText, finishReason: 'stop' });
        return;
      }
      try {
        const json = JSON.parse(data);
        // OpenAI-compatible: streaming deltas
        const content = json?.choices?.[0]?.delta?.content ?? json?.choices?.[0]?.message?.content;
        if (content) {
          fullText += content;
          onToken?.(content);
        }
        const finishReason = json?.choices?.[0]?.finish_reason;
        if (finishReason) {
          onDone?.({ fullText, finishReason });
        }
      } catch (e) {
        // Non-JSON keep-alive or partial frames; ignore
      }
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      parser.feed(decoder.decode(value, { stream: true }));
    }
  } catch (err) {
    onError?.(err);
  }
}
