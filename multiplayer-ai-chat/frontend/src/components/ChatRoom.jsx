import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket.js';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import AICharacter from './AICharacter.jsx';

export default function ChatRoom({ roomId, user }) {
  const { socket, connected } = useSocket(user);
  const [messages, setMessages] = useState([]);
  const [aiStreamingId, setAiStreamingId] = useState(null);
  const fullMap = useRef(new Map()); // requestId -> full
  const [presence, setPresence] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [mood, setMood] = useState('playful');

  useEffect(() => {
    if (!socket) return;
    socket.emit('room:join', { roomId, user });

    const onSystem = payload => {
      if (payload.type === 'join') {
        setMessages(prev => [...prev, { role: 'system', content: `${payload.user?.name || 'Someone'} joined.`, ts: payload.ts }]);
      } else if (payload.type === 'leave') {
        setMessages(prev => [...prev, { role: 'system', content: `${payload.user?.name || 'Someone'} left.`, ts: payload.ts }]);
      } else if (payload.type === 'rate_limited') {
        setMessages(prev => [...prev, { role: 'system', content: `You are sending messages too quickly. Please slow down.`, ts: payload.ts }]);
      }
    };
    const onChat = msg => setMessages(prev => [...prev, msg]);
    const onAIStarted = ({ requestId }) => {
      setAiStreamingId(requestId);
      fullMap.current.set(requestId, '');
      setMessages(prev => [...prev, { role: 'assistant', content: '', requestId }]);
    };
    const onAIToken = ({ requestId, text }) => {
      const prevFull = fullMap.current.get(requestId) || '';
      const nextFull = prevFull + text;
      fullMap.current.set(requestId, nextFull);
      setMessages(prev => prev.map(m => m.requestId === requestId ? { ...m, content: nextFull } : m));
    };
    const onAIDone = ({ requestId, fullText }) => {
      fullMap.current.set(requestId, fullText || fullMap.current.get(requestId) || '');
      setAiStreamingId(null);
      // naive mood detection
      const text = fullText || '';
      const nextMood = /\b(haha|lol|fun|joke)\b/i.test(text)
        ? 'playful'
        : /\b(question|why|how)\b/i.test(text)
        ? 'curious'
        : /\bconsider|think|perhaps|maybe\b/i.test(text)
        ? 'thoughtful'
        : /!/.test(text)
        ? 'excited'
        : 'playful';
      setMood(nextMood);
    };
    const onAIError = ({ requestId, message }) => {
      setMessages(prev => prev.map(m => m.requestId === requestId ? { ...m, content: `[AI error] ${message}` } : m));
      setAiStreamingId(null);
    };

    const onPresence = ({ users }) => setPresence(users || []);
    const onTyping = ({ user: uname, isTyping }) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        if (isTyping) next.add(uname); else next.delete(uname);
        return next;
      });
    };
    const onReact = payload => {
      setMessages(prev => prev.map(m => (m.id === payload.messageId ? { ...m, reaction: payload.emoji } : m)));
    };

    socket.on('system', onSystem);
    socket.on('chat:message', onChat);
    socket.on('ai:started', onAIStarted);
    socket.on('ai:token', onAIToken);
    socket.on('ai:done', onAIDone);
    socket.on('ai:error', onAIError);
    socket.on('presence:update', onPresence);
    socket.on('typing', onTyping);
    socket.on('message:react', onReact);

    return () => {
      socket.off('system', onSystem);
      socket.off('chat:message', onChat);
      socket.off('ai:started', onAIStarted);
      socket.off('ai:token', onAIToken);
      socket.off('ai:done', onAIDone);
      socket.off('ai:error', onAIError);
      socket.off('presence:update', onPresence);
      socket.off('typing', onTyping);
      socket.off('message:react', onReact);
    };
  }, [socket, roomId, user]);

  const sendMessage = content => {
    if (!socket || !content?.trim()) return;
    socket.emit('chat:message', { roomId, content });
  };

  const onTyping = isTyping => {
    if (!socket) return;
    socket.emit('typing', { roomId, isTyping });
  };

  const react = (messageId, emoji) => {
    if (!socket) return;
    socket.emit('message:react', { roomId, messageId, emoji });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AICharacter connected={connected} streaming={!!aiStreamingId} mood={mood} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid #2a3553', fontSize: 13, color: '#9fb0e3' }}>
        <span>Online:</span>
        <span style={{ opacity: 0.9 }}>{presence.join(', ') || '—'}</span>
        <span style={{ marginLeft: 'auto', opacity: 0.8 }}>{typingUsers.size ? `${Array.from(typingUsers).join(', ')} typing…` : ''}</span>
      </div>
      <MessageList messages={messages} user={user} onReact={react} />
      <MessageInput onSend={sendMessage} onTyping={onTyping} />
    </div>
  );
}
