import { Card } from "@/components/ui/card";
import { FlashcardTypes } from "@/types/flashcard.types";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { FolderPlus, Star, Volume2 } from "lucide-react";
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import { useState } from "react";
import FolderPickerModal from "./FolderPickerModal";

export function SearchResultCardSide(result: FlashcardTypes) {
  const { playAudio } = useAudio(result.audioUrl);
  return (
    <Card className="flex-1 rounded-lg p-4">
      <div className="flex flex-col items-start justify-between gap-2 overflow-scroll md:flex-row md:items-center">
        <p className="text-2xl font-bold">{result.word}</p>
        <Button variant="outline" onClick={playAudio} className="rounded-xl">
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
      <p>{result.flashcardId}</p>
      <p>{result.flashcard_meaningId}</p>
    </Card>
  );
}

export default function SearchResultCard({ results }: { results: FlashcardTypes[] }) {
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  return (
    <div className="space-y-4">
      {results.length > 0 &&
        results.map((result, index) => (
          <div key={index} className="bg-card text-card-foreground space-y-4 overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="flex w-full justify-end gap-2">
              <ExpandableButton
                Icon={Star}
                label="Add to favorites"
                variant="outline"
                className="hover:bg-yellow-200 hover:text-yellow-600 dark:hover:bg-yellow-900/40"
                onClick={() => {
                  console.log("Add to favorites clicked.");
                }}
              />
              <ExpandableButton
                Icon={FolderPlus}
                label="Add to folder"
                variant="outline"
                className="hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-900/40"
                onClick={() => {
                  setShowFolderPicker(true);
                }}
              />
            </div>
            {showFolderPicker && (
              <div
                className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-black/30"
                onClick={() => setShowFolderPicker(false)}
              >
                <FolderPickerModal
                  onCancel={() => {
                    setShowFolderPicker(false);
                  }}
                  word={result.word}
                />
              </div>
            )}

            <div className="flex gap-4">
              <SearchResultCardSide {...result} />
              <SearchResultCardSide {...result} />
            </div>
          </div>
        ))}
    </div>
  );
}
