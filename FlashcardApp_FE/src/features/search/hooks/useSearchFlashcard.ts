import { useState } from "react";
import { FlashcardTypes } from "@/types/flashcard.types";
import { useAudio } from "@/hooks/useAudio";
import api from "@/services/api";

export function useSearchFlashcard({ searchWord }: { searchWord: string }) {
  const [results, setResults] = useState<FlashcardTypes[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SEARCH_SOUND_URL = "/sounds/search-click.mp3";
  const { playAudio } = useAudio(SEARCH_SOUND_URL);

  const search = async () => {
    if (!searchWord.trim()) return;
    setError(null);
    setSearchLoading(true);
    playAudio();

    try {
      const response = await api.get(`flashcards/search?word=${encodeURIComponent(searchWord)}`);

      // map API response to flashcards
      const flashcards: FlashcardTypes[] = response.data.flashcards.flatMap((flashcard: any) => {
        const flashcardId = flashcard._id ?? "";
        const word = flashcard.word;
        const phonetic = flashcard.phonetics?.[0]?.pronunciation ?? "";
        const audioUrl = flashcard.phonetics?.find((p: any) => p.sound)?.sound ?? "";

        // for each meaning, for each definition, create a flashcard
        return flashcard.meanings.flatMap((meaning: any) =>
          meaning.definitions.map((def: any) => ({
            flashcardId,
            flashcard_meaningId: def._id ?? "",
            word,
            wordType: meaning.partOfSpeech,
            definition: def.definition,
            example: def.example ?? "",
            phonetic,
            imageUrl: "", // not provided by API
            audioUrl,
            word_vi: "", // not provided by API
            wordType_vi: "",
            definition_vi: [],
            example_vi: "",
            slug: flashcard.slug || "",
          }))
        );
      });

      setResults(flashcards);
    } catch (error) {
      setResults([]);
      setError("No results found.");
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  return { search, searchLoading, results, error };
}
