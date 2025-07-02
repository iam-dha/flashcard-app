import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Pause, Play, Trophy, CheckCircle, XCircle, Flame, Clock, Volume2, Search } from "lucide-react";
import useMultipleChoiceQuizGame from "./useMultipleChoiceQuizGame";
import MCQGameStartDialog from "./components/MCQGameStartDialog";
import { useSearchFlashcard } from "@/features/client/search/hooks/useSearchFlashcard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useEffect, useState } from "react";
import { FlashcardTypes } from "@/types/flashcard.types";
import CustomLoader from "@/components/custom-ui/CustomLoader";

export default function MultipleChoiceQuizPage() {
  const {
    gameStarted,
    setGameStarted,
    isLoading,
    questionsData,
    currentQuestion,
    currentQuestionData,
    selectedAnswers,
    showSuccess,
    showIncorrect,
    numberOfLives,
    lives,
    points,
    streak,
    maxStreak,
    timePerQuestion,
    timeLeft,
    timeTaken,
    totalTimeTaken,
    timeToNextQuestion,
    isPaused,
    setIsPaused,
    handleGameOpen,
    handleStartGame,
    handleAnswerSelect,
    checkAnswer,
    nextQuestion,
    resetGame,
    timeFormatter,
    isGameOver,
  } = useMultipleChoiceQuizGame();

  const [searchResults, setSearchResults] = useState<FlashcardTypes>();
  const { search, searchLoading, results } = useSearchFlashcard();

  const handleSearchWord = (word: string) => {
    search(word);
  };

  useEffect(() => {
    setSearchResults(results[0]);
  }, [results]);

  const playWordPronunciation = (audioUrl: string | undefined) => {
    if (!audioUrl) {
      console.error("Audio URL is undefined");
      return;
    }

    const audio = new Audio(audioUrl);
    audio.play();
  };

  if (!gameStarted) {
    return (
      <MCQGameStartDialog
        isLoading={isLoading}
        questionsCount={questionsData.length}
        numberOfLives={numberOfLives}
        timeLeft={timePerQuestion}
        handleGameOpen={handleGameOpen}
        handleStartGame={handleStartGame}
      />
    );
  }

  return (
    <Dialog
      open={gameStarted}
      onOpenChange={(open) => {
        if (!open) {
          resetGame();
        }
        setGameStarted(open);
      }}
    >
      <DialogContent className="flex !h-full !w-full !max-w-none flex-col border-none shadow-lg lg:!h-[800px] lg:!w-[1000px]">
        {/* Game Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1">
              {[...Array(numberOfLives)].map((_, i) => (
                <Heart key={i} className={`h-8 w-8 ${i < lives ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
              ))}
            </div>

            {/* Points */}
            <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
              <Trophy className="mr-1 h-8 w-8" />
              <p className="text-lg">{points} points</p>
            </Badge>

            {/* Current Streak */}
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-500">
              <Flame className="mr-1 h-8 w-8" />
              <p className="text-lg">Current streak: {streak}</p>
            </Badge>

            {/* Longest Streak */}
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-500">
              <Trophy className="mr-1 h-8 w-8" />
              <p className="text-lg">Longest streak: {maxStreak}</p>
            </Badge>
          </div>

          {/* Pause Button */}
          <Button variant="outline" size="sm" className="hover:bg-card/50" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>

        {/* Game Content */}
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Time left:</div>
            <Badge variant={timeLeft >= 10 ? "secondary" : "destructive"}>{timeFormatter(timeLeft)}</Badge>
          </div>

          {/* Question */}
          <Card className="bg-card/50 border-none">
            <CardContent className="space-y-2 p-4">
              <div>
                Question {currentQuestion + 1}/{questionsData.length}
              </div>
              <div className="text-lg">{currentQuestionData?.question}</div>
            </CardContent>
          </Card>

          {/* Answer Options */}
          <div className="space-y-4">
            <div className="text-sm font-medium">Select your answer:</div>
            <div className="grid grid-cols-1 gap-3">
              {currentQuestionData?.answerList.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showSuccess || showIncorrect}
                  className={`flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${
                    selectedAnswers[currentQuestion] === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${showSuccess && option === currentQuestionData.answer ? "border-green-500 bg-green-50" : ""} ${
                    showIncorrect && option === selectedAnswers[currentQuestion] && option !== currentQuestionData.answer
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <span className="text-lg">{option}</span>
                  {showSuccess && option === currentQuestionData.answer && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {showIncorrect && option === selectedAnswers[currentQuestion] && option !== currentQuestionData.answer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={checkAnswer}
              disabled={!selectedAnswers[currentQuestion] || showSuccess || showIncorrect}
              className="bg-green-500 p-6 text-xl hover:bg-green-600"
            >
              Submit Answer
            </Button>
          </div>
        </div>

        {/* Success Dialog */}
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
            <Card className="bg-background w-80">
              <CardContent className="space-y-4 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-600">Correct!</h3>
                  <p className="text-muted-foreground mt-1">You got it right! +10 points</p>
                </div>
                <Button onClick={nextQuestion} className="w-full bg-green-500 hover:bg-green-600">
                  {currentQuestion < questionsData.length - 1 ? `Next Question in ${timeToNextQuestion}s...` : "Go to Summary"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Incorrect Answer Dialog */}
        {showIncorrect && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
            <Card className="bg-background w-80">
              <CardContent className="space-y-4 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-600">Incorrect!</h3>
                  <p className="text-muted-foreground mt-1">The correct answer was: {currentQuestionData.answer}</p>
                </div>
                <Button onClick={nextQuestion} className="w-full bg-red-500 hover:bg-red-600">
                  {currentQuestion < questionsData.length - 1 && lives > 0 ? `Next Question in ${timeToNextQuestion}s...` : "Go to Summary"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Over */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
            <Card className="bg-background h-[600px] w-[600px] overflow-y-auto">
              <CardContent className="space-y-4 p-4">
                <div className="text-center text-2xl font-bold">Game Over!</div>
                <div className="grid grid-cols-3 items-center justify-between gap-2">
                  <div className="bg-card/50 flex h-full items-center justify-center gap-2 rounded-lg p-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <p className="font-semibold">Points: {points}</p>
                  </div>
                  <div className="bg-card/50 flex h-full items-center justify-center gap-2 rounded-lg p-2 text-center">
                    <Flame className="h-6 w-6 text-orange-500" />
                    <p className="font-semibold">Longest Streak: {maxStreak}</p>
                  </div>
                  <div className="bg-card/50 flex h-full items-center justify-center gap-2 rounded-lg p-2">
                    <Clock className="h-6 w-6 text-green-500" />
                    <p className="font-semibold">
                      Total time:
                      <br />
                      {totalTimeTaken} seconds
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {questionsData.map((question, index) => (
                    <div key={index} className="space-y-2 rounded-xl border-2 p-4">
                      <p className="font-semibold">
                        Question {index + 1}: {question.question}
                      </p>
                      <p className="text-sm text-gray-500">Time taken: {timeTaken[index] ? timeTaken[index] : 0} seconds</p>
                      <div className="space-y-2">
                        {question.answerList.map((option) => (
                          <div
                            key={option}
                            className={`flex items-center justify-between rounded-lg border-2 p-2 ${
                              selectedAnswers[index] === option
                                ? option === question.answer
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                                : option === question.answer
                                  ? "bg-green-100 text-green-700"
                                  : ""
                            }`}
                          >
                            <div>{option}</div>
                            <HoverCard>
                              <HoverCardTrigger>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-transparent hover:shadow-lg"
                                  onMouseEnter={() => handleSearchWord(option)}
                                >
                                  <Search className="h-4 w-4" />
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent>
                              {searchLoading ? <CustomLoader/> : (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="font-semibold">{searchResults?.word || "No word found"}</p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="hover:bg-card/50"
                                      onClick={() => playWordPronunciation(searchResults?.audio_url)}
                                    >
                                      <Volume2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-muted-foreground text-sm">{searchResults?.wordType || "No word type found"}</p>
                                  <p className="text-sm">{searchResults?.definition || "No definition found"}</p>
                                    <p className="text-muted-foreground text-sm">{searchResults?.example || ""}</p>
                                  </div>
                                )}
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={resetGame} className="w-full">
                  Back to Game Menu
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
