import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Initialize Socket connection using JWT auth token
export const initSocket = (token: string): Socket => {
  if (!socket) {
    socket = io('https://frontend-task-chatapp.onrender.com', {
      auth: { token },
      autoConnect: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

// Retrieve current active socket instance
export const getSocket = (): Socket | null => socket;

// Disconnect active socket session
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};