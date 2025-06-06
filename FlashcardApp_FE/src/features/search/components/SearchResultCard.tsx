import { Card, CardDescription } from "@/components/ui/card";
import { FlashcardTypes } from "@/types/flashcard.types";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { Star, Volume2 } from "lucide-react";
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import { useEffect, useState } from "react";
import FolderPickerDialog from "./FolderPickerDialog";
import { useFolderService } from "@/services/useFolderService";
import { toast } from "sonner";

export function useToggleFavourites(result: FlashcardTypes) {
  const { checkFlashcardInFavourites, addFlashcardToFolder, deleteFlashcardInFolder, getFavouritesSlug } = useFolderService();
  const [isFavourites, setIsFavourites] = useState(false);
  const [favouritesLoading, setFavouritesLoading] = useState(false);

  useEffect(() => {
    try {
      const checkIfFavourites = async (result: FlashcardTypes) => {
        const response = await checkFlashcardInFavourites(result.word);
        setIsFavourites(response);
      };

      checkIfFavourites(result);
    } catch (error) {
      console.error("Error checking if favourites:", error);
    }
  }, [result]);

  const handleAddToFavourites = async (result: FlashcardTypes) => {
    try {
      setFavouritesLoading(true);
      const favouritesSlug = await getFavouritesSlug();
      await addFlashcardToFolder(favouritesSlug, result.flashcardId);
      setIsFavourites(true);
      toast.info(`"${result.word}" added to favourites`, {
        action: {
          label: "Go to Favourites",
          onClick: () => {
            window.location.href = `/folders/${favouritesSlug}`;
          },
        },
      });
    } catch (error) {
      console.error("Error adding to favourites:", error);
    } finally {
      setFavouritesLoading(false);
    }
  };

  const handleRemoveFromFavourites = async (result: FlashcardTypes) => {
    try {
      setFavouritesLoading(true);
      const favouritesSlug = await getFavouritesSlug();
      await deleteFlashcardInFolder(favouritesSlug, result.word);
      setIsFavourites(false);
      toast.info(`"${result.word}" removed from favourites`, {
        action: {
          label: "Go to Favourites",
          onClick: () => {
            window.location.href = `/folders/${favouritesSlug}`;
          },
        },
      });
    } catch (error) {
      console.error("Error removing from favourites:", error);
    } finally {
      setFavouritesLoading(false);
    }
  };

  const handleToggleFavourites = (result: FlashcardTypes) => {
    if (isFavourites) {
      handleRemoveFromFavourites(result);
    } else {
      handleAddToFavourites(result);
    }
  };

  return { isFavourites, favouritesLoading, handleToggleFavourites };
}

export function SearchResultCardSide(result: FlashcardTypes) {
  const { playAudio } = useAudio(result.audioUrl);
  return (
    <Card className="flex-1 rounded-lg p-4 border-transparent shadow-md">
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <p className="text-2xl font-bold">{result.word}</p>
        <Button variant="outline" onClick={playAudio} className="rounded-xl border-transparent">
          <Volume2 className="h-5 w-5" />
          {result.phonetic && <p className="text-sm text-neutral-600 dark:text-neutral-400">{result.phonetic}</p>}
        </Button>
      </div>
      {result.wordType && <p className="text-sm text-neutral-600 dark:text-neutral-400">({result.wordType})</p>}
      {result.definition && <p>{result.definition}</p>}
      {result.example && (
        <ul className="text-neutral-600 dark:text-neutral-400">
          <li className="text-neutral-600 italic dark:text-neutral-400">{result.example}</li>
        </ul>
      )}
    </Card>
  );
}


export default function SearchResultCard({ results }: { results: FlashcardTypes[] }) {
  const { isFavourites, favouritesLoading, handleToggleFavourites } = useToggleFavourites(results[0]);

  return (
    <div className="space-y-4">
      {results.length > 0 &&
        results.map((result, index) => (
          <div key={index} className="bg-card/70 text-card-foreground space-y-4 overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="flex w-full justify-end gap-2">
              <ExpandableButton
                Icon={Star}
                label={isFavourites ? "Remove from favorites" : "Add to favorites"}
                variant="outline"
                className={
                  isFavourites
                    ? "hover:bg-yellow-300/70 bg-yellow-300/70 text-yellow-700 hover:text-yellow-700 dark:bg-yellow-900/80 dark:text-yellow-500 dark:hover:bg-yellow-900/80 dark:hover:text-yellow-500 border-transparent"
                    : "hover:bg-yellow-300/70 hover:text-yellow-700 dark:hover:bg-yellow-900/80 border-transparent"
                }
                onClick={() => handleToggleFavourites(result)}
                disabled={favouritesLoading}
              />
              <FolderPickerDialog result={result} />
            </div>

            <div className="flex gap-4">
              <SearchResultCardSide {...result} />
              <Card className="flex-1 rounded-lg p-4 border-transparent shadow-md">
                <CardDescription>The app currently does not support Vietnamese translation.</CardDescription>
              </Card>
            </div>
          </div>
        ))}
    </div>
  );
}
