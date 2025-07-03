import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FlashcardTypes } from "@/types/flashcard.types";

export default function Flashcard(flashcard: FlashcardTypes) {
  const [isFlipped, setFlip] = useState(false);

  return (
    <div className="perspective-500 aspect-[4/3] cursor-pointer hover:scale-103 transition-transform duration-200 ease-in-out" onClick={() => setFlip(!isFlipped)}>
      <div className={`relative h-full w-full transition-transform duration-300 transform-3d ${isFlipped ? "rotate-x-180" : ""}`}>
        {/* Front */}
        <div className="absolute inset-0 h-full w-full backface-hidden bg-accent/70 rounded-2xl p-4">
          <div className="flex justify-between">
            <Badge className="shadow-sm select-none" variant="secondary">
              English
            </Badge>
          </div>
          <div className="flex h-full items-center justify-center overflow-hidden p-4 text-center align-middle">
            <p className="text-4xl leading-tight text-wrap select-none">{flashcard.word}</p>
          </div>
        </div>

        {/* Back */}
        <div className={"absolute inset-0 h-full w-full rotate-x-180 overflow-auto backface-hidden"}>
          <div className="flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 h-full w-full backface-hidden bg-accent/70 rounded-2xl p-4">
              <div className="flex justify-between">
                <Badge className="shadow-sm select-none" variant="secondary">
                  Vietnamese
                </Badge>
              </div>
              <div className="flex h-full items-center justify-center overflow-hidden p-4 text-center align-middle">
                <p className="text-4xl leading-tight text-wrap select-none">{flashcard.vi_meanings ? flashcard.vi_meanings : "No Vietnamese word available."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
