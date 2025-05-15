import api from "@/services/api";
import { FolderTypes } from "@/types/folder.types";

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

  async createFolder(folderData: FolderTypes): Promise<FolderTypes> {
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
}

export const folderService = new FolderService();

