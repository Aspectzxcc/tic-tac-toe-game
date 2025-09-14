export interface Room {
  id: string;
  players: string[]; // socket IDs
  createdAt: number;
}

export class RoomStore {
  private rooms: Record<string, Room> = {};

  createRoom(id: string, playerId: string) {
    this.rooms[id] = { id, players: [playerId], createdAt: Date.now() };
  }

  joinRoom(id: string, playerId: string) {
    if (this.rooms[id]) {
      this.rooms[id].players.push(playerId);
    }
  }

  removeRoom(id: string) {
    delete this.rooms[id];
  }

  getRoom(id: string): Room | undefined {
    return this.rooms[id];
  }

  getAllRooms(): Room[] {
    return Object.values(this.rooms);
  }
}