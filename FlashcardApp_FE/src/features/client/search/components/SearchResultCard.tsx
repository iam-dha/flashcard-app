import { Card } from "@/components/ui/card";
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
      await addFlashcardToFolder(result.flashcardId, [favouritesSlug!]);
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

export function SearchResultButtonList(result: FlashcardTypes) {
  const { isFavourites, favouritesLoading, handleToggleFavourites } = useToggleFavourites(result);

  return (
    <div className="flex gap-2">
      <ExpandableButton
        Icon={Star}
        label={isFavourites ? "Remove from favorites" : "Add to favorites"}
        variant="outline"
        className={
          isFavourites
            ? "border-transparent bg-yellow-300/70 text-yellow-700 hover:bg-yellow-300/70 hover:text-yellow-700 dark:bg-yellow-900/80 dark:text-yellow-500 dark:hover:bg-yellow-900/80 dark:hover:text-yellow-500"
            : "border-transparent hover:bg-yellow-300/70 hover:text-yellow-700 dark:hover:bg-yellow-900/80"
        }
        onClick={() => handleToggleFavourites(result)}
        disabled={favouritesLoading}
      />
      <FolderPickerDialog result={result} />
    </div>
  );
}

export function SearchResultWordCard(result: FlashcardTypes) {
  const { playAudio } = useAudio(result.audio_url);
  return (
    <Card className="rounded-lg border-transparent bg-card/70 p-4 shadow-md">
      <div className="flex justify-between gap-4">
        <div className="space-y-10">
          <SearchResultButtonList {...result} />

          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-4">
              <h2 className="text-foreground text-2xl font-bold">{result.word}</h2>
              <Button variant="outline" onClick={playAudio} className="rounded-xl border-transparent">
                <Volume2 className="h-5 w-5" />
                {result.phonetic && <span className="text-secondary-foreground ml-1 text-sm">{result.phonetic}</span>}
              </Button>
            </div>
            <p className="text-foreground text-2xl font-bold">{result.vi_meanings}</p>
          </div>
        </div>

        {result.image_url && <img src={result.image_url} alt={result.word} className="aspect-[16/9] h-48 rounded-lg object-cover overflow-hidden shadow-md" />}
      </div>
    </Card>
  );
}

export function SearchResultCardSide(result: FlashcardTypes) {
  return (
    <Card className="flex-1 rounded-lg border-transparent bg-card/70 p-4 shadow-md">
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
  return (
    <div className="space-y-4">
      {results.length > 0 && <SearchResultWordCard {...results[0]} />}
      {results.length > 0 && (
        <div className="bg-card/70 text-card-foreground space-y-4 overflow-hidden rounded-xl border p-4 shadow-sm">
          <p className="text-2xl font-bold">Meanings</p>
          {results.map((result, index) => (
            <div key={index} className="flex gap-4">
              <SearchResultCardSide {...result} />
              <Card className="flex-1 rounded-lg border-transparent bg-card/70 p-4 shadow-md">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {result.wordType === "noun"
                    ? "(danh từ)"
                    : result.wordType === "verb"
                      ? "(động từ)"
                      : result.wordType === "adjective"
                        ? "(tính từ)"
                        : result.wordType === "adverb"
                          ? "(trạng từ)"
                          : result.wordType === "pronoun"
                            ? "(từ đứng)"
                            : result.wordType === "preposition"
                              ? "(giới từ)"
                              : result.wordType === "conjunction"
                                ? "(liên từ)"
                                : result.wordType === "interjection"
                                  ? "(phó từ)"
                                  : result.wordType}
                </p>
                <p>{result.definition_vi}</p>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
