import api from "@/services/api";
import { useCallback } from "react";
import { MCQGameDataTypes } from "@/types/game.types";

export function useGameService() {
  const getMCQGameData = useCallback(async (): Promise<MCQGameDataTypes[]> => {
    try {
      const response = await api.get("/game/multichoice");
      return response.data.data;
    } catch (error) {
      console.error("Error getting MCQ game data:", error);
      throw new Error("Failed to get MCQ game data");
    }
  }, []);

  return { getMCQGameData };
}