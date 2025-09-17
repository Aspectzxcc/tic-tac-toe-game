import axios from "axios";

const GAMELOGIC_URL = "http://localhost:3002/api/game";

export const gamelogicClient = axios.create({
  baseURL: GAMELOGIC_URL,
});

export const getGames = () => gamelogicClient.get("/");
export const leaveGame = (gameId: string, playerId: string) => gamelogicClient.post(`/${gameId}/leave`, { playerId });
