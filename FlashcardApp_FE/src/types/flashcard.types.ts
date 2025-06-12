export interface FlashcardTypes {
  flashcardId: string;
  flashcard_meaningId?: string;
  word: string;
  wordType?: string;
  definition: string[];
  example: string;
  phonetic?: string;
  image_url?: string;
  audio_url?: string;
  word_vi: string;
  wordType_vi?: string;
  definition_vi: string[];
  example_vi?: string;
  slug?: string;
}