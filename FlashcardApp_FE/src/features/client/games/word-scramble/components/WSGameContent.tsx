import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { WSGameDataTypes } from "@/types/game.types";
interface WSGameContentProps {
  timeLeft: number;
  currentQuestion: number;
  wordsData: WSGameDataTypes[];
  currentWord: WSGameDataTypes;
  userAnswer: string[];
  shuffledLetters: string[];
  handleAnswerBoxClick: (index: number) => void;
  handleLetterClick: (letter: string, index: number) => void;
  checkAnswer: () => void;
  setShuffledLetters: (letters: string[]) => void;
  setUserAnswer: (answer: string[]) => void;
  formatTime: (time: number) => string;
}

export default function WSGameContent({
  timeLeft,
  currentQuestion,
  wordsData,
  currentWord,
  userAnswer,
  shuffledLetters,
  handleAnswerBoxClick,
  handleLetterClick,
  checkAnswer,
  setShuffledLetters,
  setUserAnswer,
  formatTime,
}: WSGameContentProps) {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">Time left:</div>
        <Badge variant={timeLeft >= 10 ? "secondary" : "destructive"}>{formatTime(timeLeft)}</Badge>
      </div>
      {/* Definition */}
      <Card>
        <CardContent className="space-y-2 p-4">
          <div>
            Question {currentQuestion + 1}/{wordsData.length}
          </div>
          <div className="text-lg">{currentWord?.definition}</div>
        </CardContent>
      </Card>

      {/* Answer Slots */}
      <div className="space-y-4">
        <div className="text-center text-sm font-medium">Your Answer:</div>
        <div className="flex flex-wrap justify-center gap-2">
          {userAnswer.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleAnswerBoxClick(index)}
              className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 text-lg font-bold transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Shuffled Letters */}
      <div className="space-y-4">
        <div className="text-center text-sm font-medium">Available Letters:</div>
        <div className="flex flex-wrap justify-center gap-2">
          {shuffledLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter, index)}
              className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary/50 bg-primary/10 text-lg font-bold text-primary transition-colors hover:bg-primary/20"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={checkAnswer} disabled={userAnswer.includes("")} className="bg-green-500 hover:bg-green-600">
          Submit Answer
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShuffledLetters(currentWord.word.split("").sort(() => Math.random() - 0.5));
            setUserAnswer(new Array(currentWord.word.length).fill(""));
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
