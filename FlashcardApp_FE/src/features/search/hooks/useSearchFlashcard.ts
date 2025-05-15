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
      const flashcards: FlashcardTypes[] = response.data.flashcards.flatMap((e: any) => {
        const flashcardId = e._id ?? "";
        const word = e.word;
        const phonetic = e.phonetics?.[0]?.pronunciation ?? "";
        const audioUrl = e.phonetics?.find((p: any) => p.sound)?.sound ?? "";

        return e.meanings.map((meaning: any, idx: number) => ({
          word,
          wordType: meaning.partOfSpeech,
          definition: meaning.definitions.map((def: any) => def.definition + " "),
          example: meaning.definitions.find((def: any) => def.example)?.example ?? "",
          phonetic,
          imageUrl: "", // not provided by API
          audioUrl,
          word_vi: "", // not provided by API
          wordType_vi: "",
          definition_vi: [],
          example_vi: "",
          slug: e.slug || "",
        }));
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
