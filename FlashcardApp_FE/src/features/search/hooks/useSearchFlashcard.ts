import { useCallback, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { FlashcardTypes } from "@/types/flashcard.types";
import api from "@/services/api";

function oldMapApiToFlashcards(apiData: any[]): FlashcardTypes[] {
  return apiData.flatMap((e: any) => {
    const flashcardId = e._id ?? "";
    const word = e.word;
    const phonetic = e.phonetics?.[0]?.pronunciation ?? "";
    const audioUrl = e.phonetics?.find((p: any) => p.sound)?.sound ?? "";

    return e.meanings.map((meaning: any) => ({
      flashcardId,
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
}

function mapApiToFlashcards(apiData: any[]): FlashcardTypes[] {
  return apiData.flatMap((flashcard: any) => {
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
      })),
    );
  });
}

export function useSearchFlashcard({ searchWord }: { searchWord: string }) {
  const [results, setResults] = useState<FlashcardTypes[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SEARCH_SOUND_URL = "/sounds/search-click.mp3";
  const { playAudio } = useAudio(SEARCH_SOUND_URL);

  const search = useCallback(async () => {
    if (!searchWord.trim()) return;
    setError(null);
    setSearchLoading(true);
    playAudio();

    try {
      const response = await api.get(`flashcards/search?word=${encodeURIComponent(searchWord)}`);
      const flashcards: FlashcardTypes[] = mapApiToFlashcards(response.data.flashcards || []);
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
  }, [searchWord, playAudio]);

  return { search, searchLoading, results, error };
}
