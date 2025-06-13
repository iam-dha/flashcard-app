import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Pause, Play, Volume2, VolumeX, Trophy, Star, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";

interface WordScrambleData {
  word: string;
  definition: string;
}

const fetchData = async (): Promise<WordScrambleData[]> => {
  const response = await api.get("/game/word-scramble");
  const data = await response.data.data;
  console.log(data);
  return data;
};

export default function WordScramblePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wordsData, setWordsData] = useState<WordScrambleData[]>([]);
  const currentWord = wordsData[currentQuestion];

  useEffect(() => {
    if (gameStarted) {
      const fetchWordData = async () => {
        const data = await fetchData();
        setWordsData(data);
      };
      fetchWordData();
    }
  }, [gameStarted]);

  // shuffle letters when game starts or question changes
  useEffect(() => {
    if (gameStarted && wordsData.length > 0) {
      const letters = currentWord.word.split("");
      const shuffled = [...letters].sort(() => Math.random() - 0.5);
      setShuffledLetters(shuffled);
      setUserAnswer(new Array(currentWord.word.length).fill(""));
    }
  }, [gameStarted, currentQuestion, wordsData]);

  // timer countdown
  useEffect(() => {
    if (gameStarted && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLetterClick = (letter: string, index: number) => {
    const nextEmptyIndex = userAnswer.findIndex((slot) => slot === "");
    if (nextEmptyIndex !== -1) {
      const newAnswer = [...userAnswer];
      newAnswer[nextEmptyIndex] = letter;
      setUserAnswer(newAnswer);

      // Remove the letter from shuffled letters
      const newShuffled = [...shuffledLetters];
      newShuffled.splice(index, 1);
      setShuffledLetters(newShuffled);
    }
  };

  const handleAnswerSlotClick = (index: number) => {
    if (userAnswer[index] !== "") {
      const letter = userAnswer[index];

      // Remove from answer
      const newAnswer = [...userAnswer];
      newAnswer[index] = "";
      setUserAnswer(newAnswer);

      // Add back to shuffled letters
      setShuffledLetters([...shuffledLetters, letter]);
    }
  };

  const checkAnswer = () => {
    const answer = userAnswer.join("");
    if (answer === currentWord.word) {
      setPoints(points + 10);
      setShowSuccess(true);
    } else {
      setLives(lives - 1);
      // Reset the answer
      setShuffledLetters(currentWord.word.split("").sort(() => Math.random() - 0.5));
      setUserAnswer(new Array(currentWord.word.length).fill(""));
    }
  };

  const nextQuestion = () => {
    setShowSuccess(false);
    if (currentQuestion < wordsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      // Game completed
      setGameStarted(false);
      setCurrentQuestion(0);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setLives(3);
    setPoints(0);
    setTimeLeft(60);
    setIsPaused(false);
    setUserAnswer([]);
    setShuffledLetters([]);
    setShowSuccess(false);
  };

  if (!gameStarted) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Play Scramble Game</Button>
        </DialogTrigger>
        <DialogContent className="flex h-fit max-w-md flex-col shadow-lg">
          <div className="space-y-6 p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
              <Star className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">Word Scramble</h1>
              <p className="text-muted-foreground mt-2">Unscramble the letters to form the correct word based on the hint!</p>
            </div>

            <div className="text-muted-foreground space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span>📝 Questions:</span>
                <span className="font-medium">{wordsData.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>❤️ Lives:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>⏱️ Time per question:</span>
                <span className="font-medium">60 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🏆 Points per correct:</span>
                <span className="font-medium">10 points</span>
              </div>
            </div>

            <Button
              onClick={() => setGameStarted(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              size="lg"
            >
              Start Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={gameStarted} onOpenChange={setGameStarted}>
      <DialogTrigger asChild>
        <Button>Play Scramble Game</Button>
      </DialogTrigger>
      <DialogContent className="flex h-fit max-w-2xl flex-col shadow-lg">
        {/* Game Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`h-5 w-5 ${i < lives ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
              ))}
            </div>

            {/* Question Counter */}
            <Badge variant="secondary">
              Question {currentQuestion + 1}/{wordsData.length}
            </Badge>

            {/* Points */}
            <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
              <Trophy className="mr-1 h-3 w-3" />
              {points} pts
            </Badge>
          </div>

          {/* Pause Button */}
          <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>

        {/* Game Content */}
        <div className="flex-1 space-y-6 p-6">
          {/* Hint */}
          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground mb-2 text-sm">Hint:</div>
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
                  onClick={() => handleAnswerSlotClick(index)}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-lg font-bold transition-colors hover:bg-gray-100"
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
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-blue-300 bg-blue-100 text-lg font-bold text-blue-700 transition-colors hover:bg-blue-200"
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

        {/* Game Footer */}
        <div className="flex items-center justify-between border-t p-4">
          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Time:</div>
            <Badge variant={timeLeft >= 10 ? "secondary" : "destructive"}>{formatTime(timeLeft)}</Badge>
          </div>

          {/* Sound Toggle */}
          <Button variant="ghost" size="sm" onClick={() => setIsSoundOn(!isSoundOn)}>
            {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* Success Dialog */}
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <Card className="w-80 bg-background">
              <CardContent className="space-y-4 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-600">Congratulations!</h3>
                  <p className="text-muted-foreground mt-1">You got it right! +10 points</p>
                </div>
                <Button onClick={nextQuestion} className="w-full bg-green-500 hover:bg-green-600">
                  {currentQuestion < wordsData.length - 1 ? "Next Question" : "Finish Game"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Over */}
        {(lives === 0 || currentQuestion === wordsData.length || timeLeft === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <Card className="w-80 bg-background">
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
