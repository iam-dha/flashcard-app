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
    <div
      className="flex flex-col items-center justify-center overflow-hidden rounded-lg px-2 py-8 sm:px-4 m-4 flex-1"
      style={{
        background: "linear-gradient(-45deg,rgb(237, 195, 182),rgb(225, 138, 171), #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 12s ease infinite",
      }}
    >
      {lines.map((line, lineIdx) => (
        <div key={lineIdx} className="mb-1 flex flex-wrap justify-center gap-1 last:mb-0 sm:mb-2 sm:gap-2">
          {line.split("").map((letter, charIdx) => {
            const globalIdx = getGlobalIndex(lineIdx, charIdx);
            return (
              <div key={charIdx} className="perspective-1000 h-12 w-10 sm:h-16 sm:w-12 md:h-20 md:w-16 lg:h-24 lg:w-20">
                <div
                  className={`relative h-full w-full transition-transform duration-1000 ease-in-out transform-3d ${
                    flippedCards.includes(globalIdx) ? "rotate-x-0" : "rotate-x-180"
                  }`}
                >
                  {/* Front of card (letter) */}
                  <div className="border-primary/50 absolute inset-0 flex h-full w-full items-center justify-center rounded-md border border-2 bg-white shadow-md backface-hidden sm:rounded-lg sm:border-2 sm:shadow-lg">
                    <p className="text-primary text-lg font-bold sm:text-2xl md:text-3xl lg:text-4xl">{letter.toUpperCase()}</p>
                  </div>
                  {/* Back of card (solid color) */}
                  <div className="absolute inset-0 flex h-full w-full rotate-x-180 items-center justify-center rounded-md bg-indigo-500 shadow-md backface-hidden sm:rounded-lg sm:shadow-lg">
                    <div className="flex h-full w-full items-center justify-center rounded-md bg-white sm:rounded-lg"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
