import { Socket } from 'socket.io';

interface UserPayload {
  id: string;
  username: string;
}

declare module 'socket.io' {
  interface SocketData {
    user?: UserPayload;
  }
}

export const auth = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided.'));
  }

  // --- MOCK VALIDATION ---
  if (token === 'mock-jwt-for-testing') {
    const generatedId = 'user-' + Math.random().toString(36).substring(2, 9);
    
    socket.data.user = {
      id: generatedId,
      username: `mockUser-${generatedId}`
    };
    return next();
  }

  return next(new Error('Authentication error: Invalid token.'));
};