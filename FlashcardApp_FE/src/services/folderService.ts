import api from "@/services/api";
import { FolderCreateTypes, FolderTypes, GetFolderFlashcardListResponse } from "@/types/folder.types";

class FolderService {
  async getAllFolder({page, limit}: {page: number, limit: number}): Promise<FolderTypes[]> {
    try {
      const response = await api.get(`/folders?page=${page}&limit=${limit}`);
      return response.data.folders;
    } catch (error) {
      console.error("Error getting folders:", error);
      throw new Error("Failed to getting folders");
    }
  }

  async createFolder(folderData: FolderCreateTypes): Promise<FolderTypes> {
    try {
      const response = await api.post("/folders", folderData);
      return response.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw new Error("Failed to create folder");
    }
  }

  async deleteFolder(slug: string): Promise<void> {
    try {
      await api.delete(`/folders/${slug}`);
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw new Error("Failed to delete folder.");
    }
  }

  async getFolderBySlug(slug: string): Promise<FolderTypes> {
    try {
      const response = await api.get(`/folders/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Error getting folder by slug:", error);
      throw new Error("Failed to get folder by slug");
    }
  }

  async getFolderFlashcardList(slug: string): Promise<GetFolderFlashcardListResponse> {
    try {
      const response = await api.get(`/folders/${slug}/flashcards`);
      return response.data;
    } catch (error) {
      console.error("Error getting folder flashcard list:", error);
      throw new Error("Failed to get folder flashcard list");
    }
  }

  async addFlashcardToFolder(slug: string, flashcardId: string): Promise<void> {
    try {
      await api.post(`/folders/${slug}/flashcards`, { flashcardId });
    } catch (error) {
      console.error("Error adding flashcard to folder:", error);
      throw new Error("Failed to add flashcard to folder");
    }
  }
}

export const folderService = new FolderService();

