import { getGames } from "@/api/gamelogic";

export async function lobbyLoader() {
  try {
    const response = await getGames();
    return { initialRooms: response.data };
  } catch (error) {
    console.error("Failed to fetch game rooms in loader:", error);
    return { initialRooms: [] };
  }
}
