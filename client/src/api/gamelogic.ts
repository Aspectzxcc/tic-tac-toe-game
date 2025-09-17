import axios from "axios";

const gamelogicClient = axios.create({
  baseURL: "http://localhost:3002", // Gamelogic server URL
});

export const getGames = () => gamelogicClient.get("/api/game");
export const getGameById = (gameId: string) => gamelogicClient.get(`/api/game/${gameId}`);
export const createGame = (hostId: string, hostUsername: string) => gamelogicClient.post("/api/game", { hostId, hostUsername });
export const joinGame = (gameId: string, playerId: string, playerUsername: string) => gamelogicClient.post(`/api/game/${gameId}/join`, { playerId, playerUsername });
export const leaveGame = (gameId: string, playerId: string) => gamelogicClient.post(`/api/game/${gameId}/leave`, { data: { playerId } });
export const makeMove = (gameId: string, playerId: string, move: { row: number; col: number }) => gamelogicClient.post(`/api/game/${gameId}/move`, { playerID: playerId, move });