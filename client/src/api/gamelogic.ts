import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_GAMELOGIC_API_BASE_URL || "http://localhost:3002";

const gamelogicClient = axios.create({
  baseURL: API_BASE_URL,
});

export const getGames = () => gamelogicClient.get("/api/game");
export const getGameById = (gameId: string) => gamelogicClient.get(`/api/game/${gameId}`);
export const createGame = (hostId: string, hostUsername: string) => gamelogicClient.post("/api/game", { hostId, hostUsername });
export const joinGame = (gameId: string, playerId: string, playerUsername: string) => gamelogicClient.post(`/api/game/${gameId}/join`, { playerId, playerUsername });
export const leaveGame = (gameId: string, playerId: string) => gamelogicClient.post(`/api/game/${gameId}/leave`, { playerId });
export const makeMove = (gameId: string, playerId: string, move: { row: number; col: number }) => gamelogicClient.post(`/api/game/${gameId}/move`, { playerID: playerId, move });
export const resetGame = (gameId: string) => gamelogicClient.post(`/api/game/${gameId}/reset`);