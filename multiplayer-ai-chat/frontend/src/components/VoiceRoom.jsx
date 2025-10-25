import React, { useEffect, useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer, useVoiceAssistant } from '@livekit/components-react';

export default function VoiceRoom({ roomId = 'global', user }) {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    const identity = user?.name || `User-${Math.floor(Math.random() * 1000)}`;
    fetch(`${apiUrl}/voice/token?roomId=${roomId}&identity=${identity}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setToken(data);
        }
      })
      .catch(e => setError(String(e)));
  }, [roomId, user]);

  if (error) {
    return (
      <div style={{ padding: 20, color: '#ff6b6b' }}>
        <strong>Voice not available:</strong> {error}
        <br />
        <small>Configure LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET in backend .env</small>
      </div>
    );
  }

  if (!token) {
    return <div style={{ padding: 20 }}>Loading voice...</div>;
  }

  return (
    <LiveKitRoom
      serverUrl={token.url}
      token={token.token}
      connect={true}
      audio={true}
      video={false}
      style={{ height: '100%', background: '#0f162b' }}
    >
      <VoiceAssistantUI />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function VoiceAssistantUI() {
  const { state, audioTrack } = useVoiceAssistant();
  const stateLabels = {
    idle: '😴 Idle',
    listening: '👂 Listening',
    thinking: '🤔 Thinking',
    speaking: '🗣️ Speaking',
  };
  return (
    <div style={{ padding: 20, color: '#eaf0ff' }}>
      <h2>🎤 Voice Chat with Nomi</h2>
      <p style={{ fontSize: 18, marginTop: 10 }}>
        {stateLabels[state] || state}
      </p>
      <p style={{ fontSize: 14, color: '#9fb0e3', marginTop: 10 }}>
        Speak naturally. Nomi will respond with voice.
      </p>
      {audioTrack && <p style={{ marginTop: 10, color: '#5bdd8b' }}>✓ Audio connected</p>}
    </div>
  );
}
