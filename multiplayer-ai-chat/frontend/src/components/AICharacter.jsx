import React from 'react';

export default function AICharacter({ connected, streaming, mood = 'playful' }) {
  const moodEmoji = {
    excited: '🤩',
    thoughtful: '🤔',
    playful: '😄',
    curious: '🧐',
    sleepy: '😴'
  }[mood] || '😄';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: '1px solid #2a3553' }}>
      <span style={{ fontWeight: 600 }}>Nomi</span>
      <span>{streaming ? `${moodEmoji} typing…` : `${moodEmoji} idle`}</span>
      <span style={{ marginLeft: 'auto', fontSize: 12, color: connected ? '#5bdd8b' : '#ff6b6b' }}>
        {connected ? 'connected' : 'disconnected'}
      </span>
    </div>
  );
}
