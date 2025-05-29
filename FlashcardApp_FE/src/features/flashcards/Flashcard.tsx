import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlashcardTypes } from "@/types/flashcard.types";

export default function Flashcard(flashcard: FlashcardTypes) {
  const [isFlipped, setFlip] = useState(false);

  return (
    <div className="perspective-500 aspect-[4/3] cursor-pointer" onClick={() => setFlip(!isFlipped)}>
      <div className={`relative h-full w-full transition-transform duration-300 transform-3d ${isFlipped ? "rotate-x-180" : ""}`}>
        {/* Front */}
        <Card className="absolute inset-0 h-full w-full backface-hidden">
          <CardHeader className="flex justify-between pt-6">
            <Badge className="shadow-sm select-none" variant="secondary">
              English
            </Badge>
          </CardHeader>
          <CardContent className="flex h-full items-center justify-center overflow-hidden p-4 text-center align-middle">
            <p className="text-4xl leading-tight text-wrap select-none">{flashcard.word}</p>
          </CardContent>
        </Card>

        {/* Back */}
        <div className={"absolute inset-0 h-full w-full rotate-x-180 overflow-auto backface-hidden"}>
          <div className="flex h-full w-full items-center justify-center">
            <Card className="absolute inset-0 h-full w-full backface-hidden">
              <CardHeader className="flex justify-between pt-6">
                <Badge className="shadow-sm select-none" variant="secondary">
                  Vietnamese
                </Badge>
              </CardHeader>
              <CardContent className="flex h-full items-center justify-center overflow-hidden p-4 text-center align-middle">
                <p className="text-4xl leading-tight text-wrap select-none">{flashcard.word}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
