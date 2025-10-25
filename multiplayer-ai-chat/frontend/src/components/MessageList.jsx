import React, { useEffect, useRef } from 'react';

export default function MessageList({ messages, user, onReact }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div ref={ref} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {messages.map((m, i) => (
        <Message key={m.id || m.requestId || i} msg={m} selfName={user?.name} onReact={onReact} />
      ))}
    </div>
  );
}

function Message({ msg, selfName, onReact }) {
  const isSelf = msg.name && msg.name === selfName;
  const bubbleStyle = {
    alignSelf: msg.role === 'assistant' ? 'flex-start' : isSelf ? 'flex-end' : 'flex-start',
    background: msg.role === 'assistant' ? '#1b2542' : isSelf ? '#1f8b4c' : '#242f4d',
    color: '#eaf0ff',
    borderRadius: 12,
    padding: '8px 12px',
    maxWidth: '75%'
  };
  const label = msg.role === 'assistant' ? 'Nomi' : msg.name || 'User';
  const content = highlightMentions(msg.content || '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 12, color: '#9fb0e3' }}>{label}</div>
      <div style={bubbleStyle}>
        <span dangerouslySetInnerHTML={{ __html: content }} />
        {msg.id && (
          <span style={{ marginLeft: 8, fontSize: 14, cursor: 'pointer' }}>
            <button onClick={() => onReact?.(msg.id, '👍')} style={btnStyle}>👍</button>
            <button onClick={() => onReact?.(msg.id, '😂')} style={btnStyle}>😂</button>
            <button onClick={() => onReact?.(msg.id, '❤️')} style={btnStyle}>❤️</button>
          </span>
        )}
        {msg.reaction && <span style={{ marginLeft: 6 }}>{msg.reaction}</span>}
      </div>
    </div>
  );
}

const btnStyle = { background: 'transparent', border: 'none', color: '#eaf0ff', marginLeft: 4 };

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightMentions(text) {
  const safe = escapeHtml(text);
  return safe.replace(/@([A-Za-z0-9_]+)/g, '<span style="color:#5bdd8b">@$1</span>');
}
