import axios from "axios";

const gamelogicClient = axios.create({
  baseURL: "http://localhost:3002",
});

export const createGame = (playerId: string, roomId: string) => gamelogicClient.post("/games", { playerId, roomId });
export const joinGame = (gameId: string, playerId: string) => gamelogicClient.post(`/games/${gameId}/join`, { playerId });
export const calculateMove = (gameId: string, playerId: string, move: { row: number; col: number }) => gamelogicClient.post(`/games/${gameId}/move`, { playerId, move });