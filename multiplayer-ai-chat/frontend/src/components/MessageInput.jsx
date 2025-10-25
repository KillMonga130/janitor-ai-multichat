import React, { useState } from 'react';

export default function MessageInput({ onSend, onTyping }) {
  const [value, setValue] = useState('');

  const submit = e => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue('');
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #2a3553' }}>
      <input
        value={value}
        onChange={e => {
          const v = e.target.value;
          setValue(v);
          onTyping?.(!!v);
        }}
        placeholder="Type a message... (@Nomi to mention)"
        style={{ flex: 1, background: '#101934', color: '#eaf0ff', border: '1px solid #2a3553', borderRadius: 8, padding: '10px 12px' }}
      />
      <button type="submit" style={{ background: '#3c7cff', color: 'white', border: 'none', borderRadius: 8, padding: '10px 14px', fontWeight: 600 }}>
        Send
      </button>
    </form>
  );
}
