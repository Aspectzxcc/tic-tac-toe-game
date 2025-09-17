import axios from "axios";

const GAMELOGIC_URL = process.env.GAMELOGIC_URL || "http://localhost:3002";

export const gamelogicClient = axios.create({
  baseURL: GAMELOGIC_URL,
});

export const getGames = () => gamelogicClient.get("/api/game");
export const leaveGame = (gameId: string, playerId: string) => gamelogicClient.post(`/api/game/${gameId}/leave`, { playerId });
