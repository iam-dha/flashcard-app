import { useState, useEffect } from "react";
import { WSGameDataTypes, WSGameSessionTypes } from "@/types/game.types";
import { useGameService } from "@/services/useGameService";


export default function useWordScrambleGame() {
  const { getWSGameData, createWSGameSession } = useGameService();
  const [gameSession, setGameSession] = useState<WSGameSessionTypes | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<string[]>([]);

  const numberOfQuestions = 3;
  const [gameStarted, setGameStarted] = useState(false);
  const [isDataLoading, setDataLoading] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [wordsData, setWordsData] = useState<WSGameDataTypes[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const currentWord = wordsData[currentQuestion];
  const [userAnswer, setUserAnswer] = useState<string[]>([]);

  const [showSuccess, setShowSuccess] = useState(false);

  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);

  const timePerQuestion = 30;
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [isPaused, setIsPaused] = useState(false);



  const handleGameOpen = async () => {
    setDataLoading(true);
    try {
      const gameData = await getWSGameData();
      setWordsData(gameData.slice(0, numberOfQuestions));
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleStartGame = () => {
    const gameStartTime = new Date().toISOString();
    setStartTime(gameStartTime);
    setGameStarted(true);
    if (wordsData.length > 0) {
      setScrambledWords([wordsData[0].word]);
      console.log("scrambledWords", scrambledWords);
    }
  };

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

      // remove letter from shuffled letters
      const newShuffled = [...shuffledLetters];
      newShuffled.splice(index, 1);
      setShuffledLetters(newShuffled);
    }
  };

  const handleAnswerBoxClick = (index: number) => {
    if (userAnswer[index] !== "") {
      const letter = userAnswer[index];

      // remove letter from answer
      const newAnswer = [...userAnswer];
      newAnswer[index] = "";
      setUserAnswer(newAnswer);

      // add letter back to shuffled letters
      setShuffledLetters([...shuffledLetters, letter]);
    }
  };

  const checkAnswer = () => {
    const answer = userAnswer.join("");
    if (answer === currentWord.word) {
      setPoints(points + 10);
      setShowSuccess(true);
      setIsPaused((prev) => !prev);
      setCorrectWords((prev) => [...prev, currentWord.word]);
      console.log("correctWords", correctWords);
    } else {
      setLives(lives - 1);
      // reset the answer
      setShuffledLetters(currentWord.word.split("").sort(() => Math.random() - 0.5));
      setUserAnswer(new Array(currentWord.word.length).fill(""));
    }
  };

  const nextQuestion = () => {
    setShowSuccess(false);
    setIsPaused((prev) => !prev);
    if (currentQuestion < wordsData.length - 1) {
      setScrambledWords((prev) => [...prev, wordsData[currentQuestion + 1].word]);
      console.log("scrambledWords", scrambledWords);
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      // Game completed
      setIsGameOver(true);
      setCurrentQuestion(0);
      setIsPaused(true);
    }
  };

  useEffect(() => {
    console.log("Effect check:", { lives, currentQuestion, wordsDataLength: wordsData.length, timeLeft, showSuccess });
    if (!showSuccess) {
      if (lives === 0 || (currentQuestion === wordsData.length && wordsData.length > 0) || timeLeft === 0) {
        console.log("game over");
        setIsGameOver(true);
        setIsPaused(true);
      }
    }
  }, [lives, currentQuestion, wordsData.length, timeLeft, showSuccess]);

  const resetGame = () => {
    console.log("resetGame");
    console.log("scrambledWords", scrambledWords);
    console.log("correctWords", correctWords);
    setGameStarted(false);
    setCurrentQuestion(0);
    setScrambledWords([]);
    setCorrectWords([]);
    setLives(3);
    setPoints(0);
    setTimeLeft(60);
    setIsPaused(false);
    setUserAnswer([]);
    setShuffledLetters([]);
    setShowSuccess(false);
    setIsGameOver(false);
  };

  return {
    gameStarted, 
    setGameStarted,
    isDataLoading, 
    setDataLoading,
    wordsData, 
    setWordsData,
    shuffledLetters, 
    setShuffledLetters,
    currentQuestion, 
    setCurrentQuestion,
    currentWord,
    userAnswer, 
    setUserAnswer,
    showSuccess, 
    setShowSuccess,
    lives, 
    setLives,
    points, 
    setPoints,
    timePerQuestion, 
    timeLeft, 
    setTimeLeft,
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
  };
}