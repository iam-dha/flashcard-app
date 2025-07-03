import { useEffect, useState } from "react";

export default function FlashcardAppNameAnimation() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  // Split into two lines
  const lines = ["flashcard", "app"];
  // Flattened letters for animation indexing
  const letters = lines.join("").split("");

  useEffect(() => {
    let flipInterval: NodeJS.Timeout;
    let resetTimeout: NodeJS.Timeout;

    if (flippedCards.length < letters.length) {
      flipInterval = setInterval(() => {
        setFlippedCards((prev) => {
          if (prev.length >= letters.length) {
            clearInterval(flipInterval);
            return prev;
          }
          return [...prev, prev.length];
        });
      }, 200);
    } else {
      // Wait 1.5s, then reset to start the animation again
      resetTimeout = setTimeout(() => {
        setFlippedCards([]);
      }, 1500);
    }

    return () => {
      clearInterval(flipInterval);
      clearTimeout(resetTimeout);
    };
  }, [flippedCards, letters.length]);

  // Helper to get the global index for each letter in the 2D lines array
  const getGlobalIndex = (lineIdx: number, charIdx: number) => lines.slice(0, lineIdx).reduce((acc, line) => acc + line.length, 0) + charIdx;

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg">
      {lines.map((line, lineIdx) => (
        <div key={lineIdx} className="mb-2 flex flex-wrap justify-center gap-2 last:mb-0">
          {line.split("").map((letter, charIdx) => {
            const globalIdx = getGlobalIndex(lineIdx, charIdx);
            return (
              <div key={charIdx} className="perspective-1000 h-24 w-20">
                <div
                  className={`relative h-full w-full transition-transform duration-1000 ease-in-out transform-3d ${
                    flippedCards.includes(globalIdx) ? "rotate-x-0" : "rotate-x-180"
                  }`}
                >
                  {/* Front of card (letter) */}
                  <div className="border-primary/50 absolute inset-0 flex h-full w-full items-center justify-center rounded-lg border-2 bg-white shadow-lg backface-hidden">
                    <p className="text-primary text-3xl font-bold">{letter.toUpperCase()}</p>
                  </div>
                  {/* Back of card (solid color) */}
                  <div className="absolute inset-0 flex h-full w-full rotate-x-180 items-center justify-center rounded-lg bg-indigo-500 shadow-lg backface-hidden">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-white"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
