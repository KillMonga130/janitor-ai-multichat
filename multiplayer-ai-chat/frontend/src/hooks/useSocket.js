import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket(user) {
  const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000
    });
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    return () => socket.close();
  }, [url]);

  const socket = useMemo(() => socketRef.current, [connected]);
  return { socket, connected };
}
