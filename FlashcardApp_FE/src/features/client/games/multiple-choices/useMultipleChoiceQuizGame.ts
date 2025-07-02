import { useGameService } from "@/services/useGameService";
import { useState, useEffect } from "react";
import { MCQGameDataTypes } from "@/types/game.types";

export default function useMultipleChoiceQuizGame() {
  const { getMCQGameData } = useGameService();
  const numberOfQuestions = 5;
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [questionsData, setQuestionsData] = useState<MCQGameDataTypes[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const currentQuestionData = questionsData[currentQuestion];
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);

  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const timePerQuestion = 30;
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [timeTaken, setTimeTaken] = useState<number[]>([]);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  const nextQuestionTime = 10;
  const [timeToNextQuestion, setTimeToNextQuestion] = useState(nextQuestionTime);

  const handleGameOpen = async () => {
    setIsLoading(true);
    try {
      const gameData = await getMCQGameData();
      setQuestionsData(gameData.slice(0, numberOfQuestions));
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  // load data when game starts
  useEffect(() => {
    const fetchGameData = async () => {
      if (gameStarted && questionsData.length === 0) {
        const gameData = await getMCQGameData();
        setQuestionsData(gameData);
      }
    };

    fetchGameData();
  }, [gameStarted, questionsData.length, getMCQGameData]);

  // timer countdown
  useEffect(() => {
    if (gameStarted && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, isPaused, timeLeft]);

  // timer countdown for next question
  useEffect(() => {
    if (showSuccess || showIncorrect) {
      const timer = setInterval(() => {
        setTimeToNextQuestion((prev) => {
          const newValue = prev - 1;
          console.log("timeToNextQuestion countdown:", newValue);
          return newValue;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSuccess, showIncorrect]);

  // reset timer when question changes, but keep selected answers
  useEffect(() => {
    if (gameStarted && questionsData.length > 0) {
      setTimeLeft(timePerQuestion);
      setShowSuccess(false);
      setShowIncorrect(false);
      setTimeToNextQuestion(nextQuestionTime);
    }
  }, [currentQuestion, gameStarted, questionsData.length]);

  const timeFormatter = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeTaken = () => {
    const timeSpent = timePerQuestion - timeLeft;
    const newTimeTaken = [...timeTaken];
    newTimeTaken[currentQuestion] = timeSpent;
    setTimeTaken(newTimeTaken);
    setTotalTimeTaken(totalTimeTaken + timeSpent);
  }

  const handleAnswerSelect = (answer: string) => {
    if (!showSuccess && !showIncorrect) {
      // update the selected answers array for the current question
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestion] = answer;
      setSelectedAnswers(newSelectedAnswers);
    }
  };

  const checkAnswer = () => {
    const currentSelectedAnswer = selectedAnswers[currentQuestion];
    handleTimeTaken();
    if (!currentSelectedAnswer) return;

    if (currentSelectedAnswer === currentQuestionData.answer) {
      setPoints(points + 10);
      setShowSuccess(true);
      setIsPaused(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
    } else {
      setLives(lives - 1);
      setShowIncorrect(true);
      setIsPaused(true);
      setStreak(0);
      setMaxStreak(maxStreak);
    }
  };

  const nextQuestion = () => {
    setShowSuccess(false);
    setShowIncorrect(false);
    setIsPaused(false);
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // game completed
      setIsGameOver(true);
      setIsPaused(true);
      setCurrentQuestion(0);
    }
  };

  // handle automatic next question when countdown reaches 0
  useEffect(() => {
    if ((showSuccess || showIncorrect) && timeToNextQuestion === 0) {
      nextQuestion();
    }
  }, [timeToNextQuestion, showSuccess, showIncorrect]);

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setLives(3);
    setPoints(0);
    setStreak(0);
    setTimeLeft(timePerQuestion);
    setIsPaused(false);
    setSelectedAnswers([]);
    setShowSuccess(false);
    setShowIncorrect(false);
    setIsGameOver(false);
  };

  useEffect(() => {
    if (!showSuccess && !showIncorrect) {
      if (lives === 0 || (currentQuestion === questionsData.length && questionsData.length > 0) || timeLeft === 0) {
        setIsGameOver(true);
        setIsPaused(true);
      }
    }
  }, [lives, currentQuestion, questionsData.length, timeLeft, showSuccess, showIncorrect]);

  return {
    gameStarted,
    setGameStarted,
    isLoading,
    questionsData,
    currentQuestion,
    currentQuestionData,
    selectedAnswers,
    showSuccess,
    showIncorrect,
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
  };
} 