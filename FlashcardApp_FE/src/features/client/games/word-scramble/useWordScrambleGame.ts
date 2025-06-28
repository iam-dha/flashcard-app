import { useState, useEffect } from "react";
import api from "@/services/api";

export interface WordScrambleData {
  word: string;
  definition: string;
}

export default function useWordScrambleGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [isDataLoading, setDataLoading] = useState(false);

  const [wordsData, setWordsData] = useState<WordScrambleData[]>([]);
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

  const fetchData = async (): Promise<WordScrambleData[]> => {
    const response = await api.get("/game/word-scramble");
    const data = await response.data.data;
    console.log(data);
    return data;
  };

  const handleGameOpen = async () => {
    setDataLoading(true);
    try {
      const data = await fetchData();
      setWordsData(data);
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
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
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      // Game completed
      setGameStarted(false);
      setCurrentQuestion(0);
    }
  };

  const isGameOver = lives === 0 || currentQuestion === wordsData.length || timeLeft === 0;

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

  return {
    gameStarted, setGameStarted,
    isDataLoading, setDataLoading,
    wordsData, setWordsData,
    shuffledLetters, setShuffledLetters,
    currentQuestion, setCurrentQuestion,
    currentWord,
    userAnswer, setUserAnswer,
    showSuccess, setShowSuccess,
    lives, setLives,
    points, setPoints,
    timePerQuestion, timeLeft, setTimeLeft,
    isPaused, setIsPaused,
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