import axios from "axios";

const gamelogicClient = axios.create({
  baseURL: "http://localhost:3002",
});

export const createGame = (
  player1ID: string,
  player2ID: string,
  roomId: string
) => {
  return gamelogicClient.post("/api/game/create", {
    player1ID,
    player2ID,
    roomId,
  });
};
