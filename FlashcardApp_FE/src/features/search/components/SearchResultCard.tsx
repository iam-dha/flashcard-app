import { Card } from "@/components/ui/card";
import { FlashcardTypes } from "@/types/flashcard.types";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { Volume2 } from "lucide-react";

export function SearchResultCardSide(result: FlashcardTypes) {
  const { playAudio } = useAudio(result.audioUrl);
  return (
    <Card className="flex-1 rounded-lg p-4">
      <div className="flex flex-col items-start justify-between gap-2 overflow-scroll md:flex-row md:items-center">
        <p className="text-2xl font-bold">{result.word}</p>
        <Button variant="outline" onClick={playAudio} className="rounded-2xl">
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
    </Card>
  );
}

export default function SearchResultCard({ results }: { results: FlashcardTypes[] }) {
  return (
    <div className="space-y-4">
      {results.length > 0 &&
        results.map((result, index) => (
          <div key={index} className="bg-card text-card-foreground gap-4 overflow-hidden rounded-xl border p-4 shadow-sm md:flex">
            {/* English side */}
            <SearchResultCardSide {...result} />
            <SearchResultCardSide {...result} />

            {/* Vietnamese side */}
            {/* <Card className="m-4 bg-blue-500 p-8 flex-1">
              <h3 className="mb-2 text-2xl font-bold">{result.word_vi}</h3>
              {result.wordType_vi && <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">({result.wordType_vi})</p>}
              {result.definition_vi && <p className="text-md mb-3">{result.definition_vi}</p>}
              {result.example_vi && (
                <ul className="mt-4 list-inside list-disc space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li className="text-neutral-600 italic dark:text-neutral-400">{result.example_vi}</li>
                </ul>
              )}
            </Card> */}
          </div>
        ))}
    </div>
  );
}
