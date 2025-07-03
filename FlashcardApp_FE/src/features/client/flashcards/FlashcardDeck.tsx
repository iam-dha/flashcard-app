import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomProgressBar from "@/components/custom-ui/CustomProgressBar";
import useFlashcardKeyboardEvents from "@/features/client/flashcards/useFlashcardKeyboardEvents";
import { FlashcardTypes } from "@/types/flashcard.types";
import { useParams } from "react-router-dom";
import { useFolderService } from "@/services/useFolderService";
import api from "@/services/api";
import CustomLoader from "@/components/custom-ui/CustomLoader";

export function FlashcardDeck() {
  const { getFolderFlashcardList } = useFolderService();
  const { slug } = useParams<{ slug: string }>();
  const [words, setWords] = useState<FlashcardTypes[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setFlip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to map API data to FlashcardTypes (similar to useSearchFlashcard)
  const mapApiToFlashcardList = (apiData: any[]): FlashcardTypes[] => {
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
  };

  const enrichFlashcardData = async (word: string): Promise<FlashcardTypes | null> => {
    try {
      const response = await api.get(`flashcards/search?word=${encodeURIComponent(word)}`);
      const flashcards: FlashcardTypes[] = mapApiToFlashcardList(response.data.flashcards || []);
      return flashcards[0] || null; // Return the first result
    } catch (error) {
      console.error(`Error fetching enriched data for word: ${word}`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching folder data for slug:", slug);
        const response = await getFolderFlashcardList(slug as string);

        // Enrich each flashcard with complete data
        const enrichedFlashcards: FlashcardTypes[] = [];

        for (const flashcard of response.flashcards) {
          const enrichedData = await enrichFlashcardData(flashcard.word);
          if (enrichedData) {
            // Use enriched data but preserve any folder-specific information
            enrichedFlashcards.push({
              ...enrichedData,
              // Keep original flashcard ID if it exists
              flashcardId: flashcard.flashcardId || enrichedData.flashcardId,
            });
          } else {
            // Fallback to original flashcard if enrichment fails
            enrichedFlashcards.push(flashcard);
          }
        }

        setWords(enrichedFlashcards);
        console.log("Enriched Flashcards:", enrichedFlashcards);
      } catch (error) {
        console.error("Error fetching folder data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolderData();
  }, [slug, getFolderFlashcardList]);

  function clickNavigationButton({ navigationDirection }: { navigationDirection: "previous" | "next" }) {
    setFlip(false); // flip the card back to front
    if (navigationDirection === "previous") {
      // setTimeout at 100ms allow the card to finish flipping before changing the word
      setTimeout(() => {
        setCurrentFlashcardIndex((prevIndex) => {
          return prevIndex > 0 ? prevIndex - 1 : 0;
        });
      }, 100);
    } else if (navigationDirection === "next") {
      // setTimeout at 100ms allow the card to finish flipping before changing the word
      setTimeout(() => {
        setCurrentFlashcardIndex((prevIndex) => {
          return prevIndex < words.length - 1 ? prevIndex + 1 : words.length - 1;
        });
      }, 100);
    }
  }

  // handle keyboard events for navigation and flipping
  useFlashcardKeyboardEvents(clickNavigationButton, setFlip, isFlipped);

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-64 items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6">
      {/* Flashcard */}
      <div
        className="perspective-500 aspect-[21/9] cursor-pointer transition-transform duration-200 ease-in-out hover:scale-101 sm:aspect-[16/9] md:aspect-[21/9]"
        onClick={() => setFlip(!isFlipped)}
      >
        <div className={`relative h-full w-full transition-transform duration-300 transform-3d ${isFlipped ? "rotate-x-180" : ""}`}>
          {/* Front */}
          <div className="bg-accent/70 absolute inset-0 h-full w-full rounded-xl p-3 backface-hidden sm:rounded-2xl sm:p-4 md:p-6">
            <div className="flex justify-between">
              <Badge className="text-xs shadow-sm select-none sm:text-sm" variant="secondary">
                English
              </Badge>
            </div>
            <div className="flex h-full items-center justify-center overflow-hidden p-2 text-center sm:p-4">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <p className="text-2xl leading-tight font-semibold sm:text-4xl md:text-5xl lg:text-6xl">{words[currentFlashcardIndex]?.word}</p>
                {words[currentFlashcardIndex]?.phonetic && (
                  <p className="text-muted-foreground text-sm sm:text-lg md:text-xl lg:text-2xl">{words[currentFlashcardIndex]?.phonetic}</p>
                )}
              </div>
            </div>
          </div>

          {/* Back */}
          <div className={"absolute inset-0 h-full w-full rotate-x-180 overflow-auto backface-hidden"}>
            <div className="flex h-full w-full items-center justify-center">
              <div className="bg-accent/70 absolute inset-0 h-full w-full rounded-xl p-3 backface-hidden sm:rounded-2xl sm:p-4 md:p-6">
                <div className="flex justify-between">
                  <Badge className="text-xs shadow-sm select-none sm:text-sm" variant="secondary">
                    Vietnamese
                  </Badge>
                </div>
                <div className="flex h-full flex-col items-center justify-center gap-2 overflow-hidden p-2 text-center sm:gap-3 sm:p-4 md:gap-4">
                  <p className="text-2xl leading-tight font-semibold text-wrap select-none sm:text-4xl md:text-5xl lg:text-6xl">
                    {words[currentFlashcardIndex]?.vi_meanings ? words[currentFlashcardIndex]?.vi_meanings : "No Vietnamese word available."}
                  </p>
                  {words[currentFlashcardIndex]?.image_url && (
                    <img
                      src={words[currentFlashcardIndex]?.image_url}
                      alt={words[currentFlashcardIndex]?.word}
                      className="mt-2 max-h-20 max-w-20 rounded-lg object-cover sm:max-h-32 sm:max-w-32 md:max-h-40 md:max-w-40 lg:max-h-48 lg:max-w-48"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="mt-4 sm:mt-6">
        <CustomProgressBar currentIndex={currentFlashcardIndex} length={words.length} />
      </div>

      {/* previous and next button */}
      <div className="flex justify-between gap-4 select-none">
        {/* previous button */}
        <Button
          className="flex-1 cursor-pointer sm:flex-none"
          variant="outline"
          onClick={() => clickNavigationButton({ navigationDirection: "previous" })}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <p className="hidden pr-2 sm:block">Previous</p>
          <p className="sm:hidden">Prev</p>
        </Button>

        {/* next button */}
        <Button
          className="flex-1 cursor-pointer sm:flex-none"
          variant="outline"
          onClick={() => clickNavigationButton({ navigationDirection: "next" })}
        >
          <p className="hidden pl-2 sm:block">Next</p>
          <p className="sm:hidden">Next</p>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  );
}
