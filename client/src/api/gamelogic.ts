import axios from "axios";

const gameClient = axios.create({
  baseURL: "http://localhost:3002", // Gamelogic server URL
});

export const getGames = () => gameClient.get("/api/game");
export const getGameById = (gameId: string) => gameClient.get(`/api/game/${gameId}`);
export const createGame = (hostId: string, hostUsername: string) => gameClient.post("/api/game", { hostId, hostUsername });
export const joinGame = (gameId: string, playerId: string, playerUsername: string) => gameClient.post(`/api/game/${gameId}/join`, { playerId, playerUsername });
export const leaveGame = (gameId: string, playerId: string) => gameClient.post(`/api/game/${gameId}/leave`, { data: { playerId } });
export const makeMove = (gameId: string, playerId: string, move: { row: number; col: number }) => gameClient.post(`/api/game/${gameId}/move`, { playerID: playerId, move });