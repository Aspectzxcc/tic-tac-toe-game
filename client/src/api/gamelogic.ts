import axios from "axios";

const gameClient = axios.create({
  baseURL: "http://localhost:3002", // Gamelogic server URL
});

export const getGames = () => gameClient.get("/api/game");
export const getGameById = (gameId: string) => gameClient.get(`/api/game/${gameId}`);
export const createGame = (hostId: string) => gameClient.post("/api/game", { hostId });
export const joinGame = (gameId: string, playerId: string) => gameClient.post(`/api/game/${gameId}/join`, { playerId });
