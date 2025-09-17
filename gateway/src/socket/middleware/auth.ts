import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

declare module 'socket.io' {
  interface SocketData {
    user: UserPayload;
  }
}

export const auth = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, "secretKey") as UserPayload;
    socket.data.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token.'));
  }
};