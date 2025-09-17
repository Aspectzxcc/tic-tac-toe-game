import axios from "axios";

const gameClient = axios.create({
  baseURL: "http://localhost:3002", // Gamelogic server URL
});

export const getGames = () => gameClient.get("/api/game");
export const getGameById = (gameId: string) => gameClient.get(`/api/game/${gameId}`);
