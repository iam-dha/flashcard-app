import api from "@/services/api";
import { useCallback } from "react";
import { WSGameDataTypes, WSGameSessionTypes, MCQGameDataTypes, GetWSGameHistoryParams } from "@/types/game.types";

export function useGameService() {
  const getWSGameData = useCallback(async (): Promise<WSGameDataTypes[]> => {
    try {
      const response = await api.get("/game/word-scramble");
      return response.data.data;
    } catch (error) {
      console.error("Error getting WS game data:", error);
      throw new Error("Failed to get WS game data");
    }
  }, []);

  const createWSGameSession = useCallback(async (data: WSGameSessionTypes): Promise<WSGameSessionTypes> => {
    try {
      const response = await api.post("/game/word-scramble", data);
      return response.data.data;
    } catch (error) {
      console.error("Error creating WS game session:", error);
      throw new Error("Failed to create WS game session");
    }
  }, []);

  const getWSGameHistory = useCallback(async ({ page, limit, sortBy, sortOrder }: GetWSGameHistoryParams): Promise<WSGameSessionTypes[]> => {
    try {
      const response = await api.get(`/game/word-scramble/history?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      return response.data.data;
    } catch (error) {
      console.error("Error getting WS game history:", error);
      throw new Error("Failed to get WS game history");
    }
  }, []);

  const getMCQGameData = useCallback(async (): Promise<MCQGameDataTypes[]> => {
    try {
      const response = await api.get("/game/multichoice");
      return response.data.data;
    } catch (error) {
      console.error("Error getting MCQ game data:", error);
      throw new Error("Failed to get MCQ game data");
    }
  }, []);

  return { getWSGameData, createWSGameSession, getWSGameHistory, getMCQGameData };
}
