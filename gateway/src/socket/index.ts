import { Server, Socket } from 'socket.io';
import { handleDisconnect, handleReconnect } from './controller/disconnectController.js';
import { auth } from './middleware/auth.js';
import { addUser, broadcastOnlinePlayers } from './onlinePlayersManager.js';

export default function registerSocketHandlers(io: Server) {
  io.use(auth);
  io.on('connection', (socket: Socket) => {
    const user = { id: socket.data.user.id, username: socket.data.user.username };
    
    addUser(user);
    handleReconnect(socket); 
    
    broadcastOnlinePlayers(io);

    console.log(`${user.username} connected`);
    
    socket.on('online-players:get', () => {
      broadcastOnlinePlayers(io);
    });

    socket.on('disconnect', () => handleDisconnect(io, socket));
  });
}