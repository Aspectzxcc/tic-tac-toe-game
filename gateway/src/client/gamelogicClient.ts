import axios from "axios";

const gamelogicClient = axios.create({
  baseURL: "http://localhost:3002",
});

export const createGame = (playerId: string, roomId: string) => gamelogicClient.post("/api/game/create", { playerId, roomId });
export const joinGame = (gameId: string, playerId: string) => gamelogicClient.post(`/api/game/${gameId}/join`, { playerId });
export const calculateMove = (gameId: string, playerId: string, move: { row: number; col: number }) => gamelogicClient.post(`/api/game/${gameId}/move`, { playerId, move });