import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Pause, Play, Trophy, CheckCircle, XCircle } from "lucide-react";
import useMultipleChoiceQuizGame from "./useMultipleChoiceQuizGame";
import MCGameStartDialog from "./components/MCQGameStartDialog";

export default function MultipleChoiceQuizPage() {
  const {
    gameStarted,
    setGameStarted,
    isLoading,
    questionsData,
    currentQuestion,
    currentQuestionData,
    selectedAnswer,
    showSuccess,
    showIncorrect,
    lives,
    points,
    timePerQuestion,
    timeLeft,
    isPaused,
    setIsPaused,
    handleGameOpen,
    handleStartGame,
    handleAnswerSelect,
    checkAnswer,
    nextQuestion,
    resetGame,
    formatTime,
  } = useMultipleChoiceQuizGame();

  if (!gameStarted) {
    return (
      <MCGameStartDialog
        isLoading={isLoading}
        questionsCount={questionsData.length}
        timeLeft={timePerQuestion}
        handleGameOpen={handleGameOpen}
        handleStartGame={handleStartGame}
      />
    );
  }

  return (
    <Dialog open={gameStarted} onOpenChange={setGameStarted}>
      <DialogContent className="flex h-fit max-w-2xl flex-col border-none shadow-lg">
        {/* Game Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`h-5 w-5 ${i < lives ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
              ))}
            </div>

            {/* Points */}
            <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
              <Trophy className="mr-1 h-3 w-3" />
              {points} points
            </Badge>
          </div>

          {/* Pause Button */}
          <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>

        {/* Game Content */}
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Time left:</div>
            <Badge variant={timeLeft >= 10 ? "secondary" : "destructive"}>{formatTime(timeLeft)}</Badge>
          </div>

          {/* Question */}
          <Card>
            <CardContent className="space-y-2 p-4">
              <div>
                Question {currentQuestion + 1}/{questionsData.length}
              </div>
              <div className="text-lg">{currentQuestionData?.question}</div>
            </CardContent>
          </Card>

          {/* Answer Options */}
          <div className="space-y-4">
            <div className="text-center text-sm font-medium">Select your answer:</div>
            <div className="grid grid-cols-1 gap-3">
              {currentQuestionData?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showSuccess || showIncorrect}
                  className={`flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${
                    selectedAnswer === option ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${showSuccess && option === currentQuestionData.correctAnswer ? "border-green-500 bg-green-50" : ""} ${
                    showIncorrect && option === selectedAnswer && option !== currentQuestionData.correctAnswer ? "border-red-500 bg-red-50" : ""
                  }`}
                >
                  <span className="text-lg">{option}</span>
                  {showSuccess && option === currentQuestionData.correctAnswer && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {showIncorrect && option === selectedAnswer && option !== currentQuestionData.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button onClick={checkAnswer} disabled={!selectedAnswer || showSuccess || showIncorrect} className="bg-green-500 hover:bg-green-600">
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
                  {currentQuestion < questionsData.length - 1 ? "Next Question" : "Finish Game"}
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
                  <p className="text-muted-foreground mt-1">The correct answer was: {currentQuestionData.correctAnswer}</p>
                </div>
                <Button onClick={nextQuestion} className="w-full bg-red-500 hover:bg-red-600">
                  {currentQuestion < questionsData.length - 1 ? "Next Question" : "Finish Game"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Over */}
        {(lives === 0 || currentQuestion === questionsData.length || timeLeft === 0) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
            <Card className="bg-background w-80">
              <CardContent className="space-y-4 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-600">Game Over!</h3>
                  <p className="text-muted-foreground mt-1">Final Score: {points} points</p>
                </div>
                <Button onClick={resetGame} className="w-full">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
