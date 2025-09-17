import type { LoaderFunctionArgs } from "react-router-dom";
import { getGameById } from "@/api/gamelogic";

export async function gameLoader({ params }: LoaderFunctionArgs) {
  const { gameId } = params;
  if (!gameId) {
    throw new Response("Not Found", { status: 404 });
  }
  try {
    const response = await getGameById(gameId);
    return { game: response.data };
  } catch (error) {
    console.error("Failed to fetch game data:", error);
    throw new Response("Game Not Found", { status: 404 });
  }
}
