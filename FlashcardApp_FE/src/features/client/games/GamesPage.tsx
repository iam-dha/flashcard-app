import MultipleChoiceQuizPage from "./multiple-choices/MultipleChoiceQuizPage";
import WordScramblePage from "./word-scramble/WordScramblePage";
import { useEffect, useState } from "react";

// Animated background for Word Scramble game
export function WSGameBackground() {
  const [shufflingLetters, setShufflingLetters] = useState<
    Array<{ id: number; letter: string; x: number; y: number; targetX: number; targetY: number; delay: number }>
  >([]);
  const [isFormed, setIsFormed] = useState(false);

  useEffect(() => {
    const letters = ["W", "O", "R", "D", " ", "S", "C", "R", "A", "M", "B", "L", "E"];

    // Calculate target positions for "WORD SCRAMBLE" in a straight line
    const calculateTargetPositions = () => {
      const positions: Array<{ x: number; y: number }> = [];
      const startX = 15; // Start at 15% from left
      const y = 50; // Center vertically at 50%
      const spacing = 5.5; // Space between letters (in percentage)

      letters.forEach((_, index) => {
        positions.push({
          x: startX + index * spacing,
          y: y,
        });
      });

      return positions;
    };

    // Generate random scattered positions
    const generateRandomPositions = () => {
      return letters.map(() => ({
        x: Math.random() * 80 + 10, // Random position between 10% and 90%
        y: Math.random() * 60 + 20, // Random position between 20% and 80%
      }));
    };

    const targetPositions = calculateTargetPositions();

    // Initialize with scattered positions
    const initializeLetters = () => {
      const randomPositions = generateRandomPositions();
      const initialLetters = letters.map((letter, index) => ({
        id: index,
        letter,
        x: randomPositions[index].x,
        y: randomPositions[index].y,
        targetX: targetPositions[index].x,
        targetY: targetPositions[index].y,
        delay: Math.random() * 0.8,
      }));
      setShufflingLetters(initialLetters);
    };

    // Start with scattered letters
    initializeLetters();

    // Animation loop
    const animationLoop = () => {
      // Form the word
      setIsFormed(true);

      setTimeout(() => {
        // Scatter the letters
        setIsFormed(false);
        const newRandomPositions = generateRandomPositions();
        setShufflingLetters((prev) =>
          prev.map((letter, index) => ({
            ...letter,
            x: newRandomPositions[index].x,
            y: newRandomPositions[index].y,
            delay: Math.random() * 0.8,
          })),
        );
      }, 3000); // Stay formed for 3 seconds
    };

    // Start first animation after 1 second
    const startTimer = setTimeout(animationLoop, 1000);

    // Continue the loop every 5 seconds
    const loopTimer = setInterval(animationLoop, 5000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(loopTimer);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Shuffling letters */}
      {shufflingLetters.map((letter) => (
        <div
          key={letter.id}
          className={`border-primary/60 bg-primary/20 text-primary/80 absolute flex h-8 w-8 items-center justify-center rounded border-2 text-xs font-bold transition-all duration-1500 ease-in-out ${
            letter.letter === " " ? "opacity-0" : ""
          }`}
          style={{
            left: isFormed ? `${letter.targetX}%` : `${letter.x}%`,
            top: isFormed ? `${letter.targetY}%` : `${letter.y}%`,
            animation: `float 3s ease-in-out infinite`,
            animationDelay: `${letter.delay}s`,
            transitionDelay: `${letter.delay * 200}ms`,
          }}
        >
          {letter.letter}
        </div>
      ))}

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(2deg);
          }
          50% {
            transform: translateY(-2px) rotate(-1deg);
          }
          75% {
            transform: translateY(-8px) rotate(1deg);
          }
        }
      `}</style>
    </div>
  );
}

export function MCQGameBackground() {
  const [currentOption, setCurrentOption] = useState(0);
  const question = "What do you call a bear with no teeth?";
  const options = ["A gummy bear!", "A grizzly", "A polar bear", "A black bear"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOption((prev) => (prev + 1) % options.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [options.length]);

  return (
    <div className="flex flex-col">
      {/* Mock Question */}
      <div className="border-primary/40 bg-primary/15 mb-4 rounded-lg border-2 p-3">
        <div className="text-primary/70 text-xs font-medium">Question 3/10</div>
        <div className="text-primary/90 text-sm font-semibold">{question}</div>
      </div>

      {/* Mock Answer Options */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={index}
            className={`rounded-lg border-2 p-2 text-xs transition-all duration-500 ${
              index === currentOption ? "border-primary/60 bg-primary/25 text-primary/90" : "border-primary/30 bg-primary/10 text-primary/70"
            }`}
            style={{
              transform: index === currentOption ? "scale(1.02)" : "scale(1)",
              boxShadow: index === currentOption ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
          >
            {option}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}

function GameCard({
  title = "Game Title",
  description = "Game description",
  playButton,
  backgroundComponent,
}: {
  title?: string;
  description?: string;
  playButton?: React.ReactElement;
  backgroundComponent?: React.ReactElement;
}) {
  return (
    <div>
      <div className="bg-card/30 relative flex h-[500px] w-full flex-col justify-between overflow-hidden rounded-lg p-4 shadow transition-shadow hover:shadow-lg">
        {/* Animated Background */}
        <div className="flex h-full items-center justify-center">{backgroundComponent}</div>
        {/* Content with better background for readability */}
        <div className="bg-background/50 relative z-10 mt-auto flex flex-col gap-2 rounded-lg p-4 backdrop-blur-sm">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
          {playButton}
        </div>
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <div className="flex h-full flex-col">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <GameCard
            title="Word Scramble"
            description="Unscramble the letters to form a word. A fun way to test your vocabulary!"
            playButton={<WordScramblePage />}
            backgroundComponent={<WSGameBackground />}
          />
          <GameCard
            title="Multiple Choice Quiz"
            description="Test your knowledge with multiple choice questions on various topics."
            playButton={<MultipleChoiceQuizPage />}
            backgroundComponent={<MCQGameBackground />}
        />
      </div>
    </div>
  );
}
