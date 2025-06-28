import { Dialog, DialogContent } from "@/components/ui/dialog";
import useWordScrambleGame from "./useWordScrambleGame";
import WSGameStartDialog from "./components/WSGameStartDialog";
import WSGameHeader from "./components/WSGameHeader";
import WSGameContent from "./components/WSGameContent";
import WSGameOverDialog from "./components/WSGameOverDialog";
import WSGameSuccessDialog from "./components/WSGameSuccessDialog";

export default function WordScramblePage() {
  const {
    gameStarted,
    setGameStarted,
    isDataLoading,
    wordsData,
    shuffledLetters,
    setShuffledLetters,
    currentQuestion,
    currentWord,
    userAnswer,
    setUserAnswer,
    showSuccess,
    lives,
    points,
    timePerQuestion,
    timeLeft,
    isPaused,
    setIsPaused,
    handleGameOpen,
    handleStartGame,
    handleLetterClick,
    handleAnswerBoxClick,
    checkAnswer,
    nextQuestion,
    resetGame,
    formatTime,
    isGameOver,
  } = useWordScrambleGame();

  if (!gameStarted) {
    return (
      <WSGameStartDialog
        isLoading={isDataLoading}
        wordsCount={wordsData.length}
        timeLeft={timePerQuestion}
        handleGameOpen={handleGameOpen}
        handleStartGame={handleStartGame}
      />
    );
  }

  return (
    <Dialog open={gameStarted} onOpenChange={setGameStarted}>
      <DialogContent className="flex !max-w-none lg:!h-[800px] !h-full lg:!w-[1000px] !w-full flex-col border-none shadow-lg">
        <WSGameHeader lives={lives} points={points} isPaused={isPaused} setIsPaused={setIsPaused} />

        <WSGameContent
          timeLeft={timeLeft}
          currentQuestion={currentQuestion}
          wordsData={wordsData}
          currentWord={currentWord}
          userAnswer={userAnswer}
          shuffledLetters={shuffledLetters}
          handleAnswerBoxClick={handleAnswerBoxClick}
          handleLetterClick={handleLetterClick}
          checkAnswer={checkAnswer}
          setShuffledLetters={setShuffledLetters}
          setUserAnswer={setUserAnswer}
          formatTime={formatTime}
        />

        {showSuccess && <WSGameSuccessDialog nextQuestion={nextQuestion} currentQuestion={currentQuestion} wordsData={wordsData} />}

        {isGameOver && <WSGameOverDialog points={points} resetGame={resetGame} />}
      </DialogContent>
    </Dialog>
  );
}
