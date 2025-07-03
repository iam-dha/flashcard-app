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
    numberOfLives,
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
    <Dialog
      open={gameStarted}
      onOpenChange={(open) => {
        if (!open) {
          resetGame();
        }
        setGameStarted(open);
      }}
    >
      <DialogContent className="flex !h-full !w-full !max-w-none flex-col border-none shadow-lg lg:!h-[80vh] lg:!w-[60vw]">
        <WSGameHeader lives={lives} numberOfLives={numberOfLives} points={points} isPaused={isPaused} setIsPaused={setIsPaused} />

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
