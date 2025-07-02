import { z } from "zod";
import { FlashcardTypes } from "./flashcard.types";

export interface FolderTypes {
  name: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  flashcardCount: number;
  createdAt: string;
  slug: string;
}

export interface GetAllFoldersResponse {
  total_pages: number;
  folders: FolderTypes[];
}

export interface GetFolderFlashcardListResponse {
  total_count: number;
  page: number;
  total_pages: number;
  flashcards: FlashcardTypes[];
}

export const folderNameMaxLength = 64;

export const folderCreateSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(folderNameMaxLength, `Folder name must be less than ${folderNameMaxLength} characters`),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional().default(false),
});

export type FolderCreateTypes = z.infer<typeof folderCreateSchema>;

export interface FolderCheckResponse {
  folder: {
    name: string;
    slug: string;
  };
  existing: boolean;
}