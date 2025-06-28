import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomProgressBar from "@/components/custom-ui/CustomProgressBar";
import useFlashcardKeyboardEvents from "@/features/client/flashcards/useFlashcardKeyboardEvents";
import { FlashcardTypes } from "@/types/flashcard.types";
import { useParams } from "react-router-dom";
import { useFolderService } from "@/services/useFolderService";

export function FlashcardDeck() {
  const { getFolderFlashcardList, getFolderBySlug } = useFolderService();
  const { slug } = useParams<{ slug: string }>();
  const [flashcards, setFlashcards] = useState<FlashcardTypes[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setFlip] = useState(false);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        console.log("Fetching folder data for slug:", slug);
        const response = await getFolderFlashcardList(slug as string);
        setFlashcards(response.flashcards);
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };

    fetchFolderData();
  }, [slug]);

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
          return prevIndex < flashcards.length - 1 ? prevIndex + 1 : flashcards.length - 1;
        });
      }, 100);
    }
  }

  // handle keyboard events for navigation and flipping
  useFlashcardKeyboardEvents(clickNavigationButton, setFlip, isFlipped);

  return (
    <div className="container mx-auto">
      {/* Flashcard */}
      <div
        className="perspective-500 aspect-[21/9] cursor-pointer transition-transform duration-200 ease-in-out hover:scale-101"
        onClick={() => setFlip(!isFlipped)}
      >
        <div className={`relative h-full w-full transition-transform duration-300 transform-3d ${isFlipped ? "rotate-x-180" : ""}`}>
          {/* Front */}
          <div className="bg-accent/70 absolute inset-0 h-full w-full rounded-2xl p-4 backface-hidden">
            <div className="flex justify-between">
              <Badge className="shadow-sm select-none" variant="secondary">
                English
              </Badge>
            </div>
            <div className="flex h-full items-center justify-center overflow-hidden p-4 text-center align-middle">
              <p className="text-4xl leading-tight text-wrap select-none">{flashcards[currentFlashcardIndex]?.word}</p>
            </div>
          </div>

          {/* Back */}
          <div className={"absolute inset-0 h-full w-full rotate-x-180 overflow-auto backface-hidden"}>
            <div className="flex h-full w-full items-center justify-center">
              <div className="bg-accent/70 absolute inset-0 h-full w-full rounded-2xl p-4 backface-hidden">
                <div className="flex justify-between">
                  <Badge className="shadow-sm select-none" variant="secondary">
                    Vietnamese
                  </Badge>
                </div>
                <div className="flex h-full items-center justify-center overflow-hidden p-4 text-center align-middle">
                  <p className="text-4xl leading-tight text-wrap select-none">
                    {flashcards[currentFlashcardIndex]?.word_vi ? flashcards[currentFlashcardIndex]?.word_vi : "No Vietnamese word available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* progress bar */}
      <CustomProgressBar currentIndex={currentFlashcardIndex} length={flashcards.length} />

      {/* previous and next button */}
      <div className="flex justify-between select-none">
        {/* previous button */}
        <Button className="cursor-pointer" variant="outline" onClick={() => clickNavigationButton({ navigationDirection: "previous" })}>
          <ChevronLeft />
          <p className="pr-2">Previous</p>
        </Button>

        {/* next button */}
        <Button className="cursor-pointer" variant="outline" onClick={() => clickNavigationButton({ navigationDirection: "next" })}>
          <p className="pl-2">Next</p>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
