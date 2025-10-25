import React, { useMemo, useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';
import VoiceRoom from './components/VoiceRoom.jsx';

export default function App() {
  const defaultRoom = useMemo(() => 'global', []);
  const user = useMemo(() => ({ name: `User-${Math.floor(Math.random()*1000)}` }), []);
  const [mode, setMode] = useState('chat'); // 'chat' or 'voice'

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', background: '#0b1220', color: '#f2f6ff' }}>
      <div style={{ width: 'min(900px, 95vw)', height: '80vh', border: '1px solid #2a3553', borderRadius: 12, overflow: 'hidden', background: '#0f162b' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #2a3553', fontWeight: 600 }}>
          <span>Multiplayer AI Chat — Nomi</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={() => setMode('chat')} style={tabStyle(mode === 'chat')}>💬 Chat</button>
            <button onClick={() => setMode('voice')} style={tabStyle(mode === 'voice')}>🎤 Voice</button>
          </div>
        </div>
        {mode === 'chat' ? (
          <ChatRoom roomId={defaultRoom} user={user} />
        ) : (
          <VoiceRoom roomId={defaultRoom} user={user} />
        )}
      </div>
    </div>
  );
}

const tabStyle = active => ({
  background: active ? '#3c7cff' : 'transparent',
  color: active ? '#fff' : '#9fb0e3',
  border: active ? 'none' : '1px solid #2a3553',
  borderRadius: 6,
  padding: '6px 12px',
  fontWeight: active ? 600 : 400,
  cursor: 'pointer'
});
