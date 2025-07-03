import { useCallback, useState } from "react";
import { FlashcardTypes } from "@/types/flashcard.types";
import api from "@/services/api";

function mapApiToFlashcardList(apiData: any[]): FlashcardTypes[] {
  return apiData.flatMap((flashcard: any) => {
    const flashcardId = flashcard._id;
    const word = flashcard.word;
    const vi_meanings = flashcard.vi_meanings ?? "";
    const phonetic = flashcard.phonetics?.[0]?.pronunciation ?? "";
    const audio_url = flashcard.phonetics?.find((p: any) => p.sound)?.sound ?? "";
    const image_url = flashcard.image_url ?? "";

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
        image_url,
        audio_url,
        vi_meanings,
        wordType_vi: "",
        definition_vi: def.vi_definition,
        example_vi: "",
        slug: flashcard.slug || "",
      })),
    );
  });
}

export function useSearchFlashcard() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [results, setResults] = useState<FlashcardTypes[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (word?: string) => {
    const searchTerm = word ?? searchWord;
    if (!searchTerm.trim()) return;
    setError(null);
    setSearchLoading(true);

    try {
      const response = await api.get(`flashcards/search?word=${encodeURIComponent(searchTerm)}`);
      const flashcards: FlashcardTypes[] = mapApiToFlashcardList(response.data.flashcards || []);
      setResults(flashcards);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setResults([]);
        setError("No results found. Please try a different word.");
      } else if (error.response?.status === 500) {
        setResults([]);
        setError("An error occurred while searching. Please try again.");
      }
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  return { searchWord, setSearchWord, search, searchLoading, results, error };
}
