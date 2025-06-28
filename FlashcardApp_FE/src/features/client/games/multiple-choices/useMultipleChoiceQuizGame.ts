import { useState, useEffect } from "react";

interface MultipleChoiceData {
  question: string;
  correctAnswer: string;
  options: string[];
}

// Mock data for the multiple choice game
const mockMultipleChoiceData: MultipleChoiceData[] = [
  {
    question: "What is the capital of France?",
    correctAnswer: "Paris",
    options: ["London", "Paris", "Berlin", "Madrid"]
  },
  {
    question: "Which planet is known as the Red Planet?",
    correctAnswer: "Mars",
    options: ["Venus", "Mars", "Jupiter", "Saturn"]
  },
  {
    question: "What is the largest ocean on Earth?",
    correctAnswer: "Pacific Ocean",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"]
  },
  {
    question: "Who painted the Mona Lisa?",
    correctAnswer: "Leonardo da Vinci",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"]
  },
  {
    question: "What is the chemical symbol for gold?",
    correctAnswer: "Au",
    options: ["Ag", "Au", "Fe", "Cu"]
  },
  {
    question: "Which year did World War II end?",
    correctAnswer: "1945",
    options: ["1943", "1944", "1945", "1946"]
  },
  {
    question: "What is the largest mammal in the world?",
    correctAnswer: "Blue Whale",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]
  },
  {
    question: "Which programming language was created by Brendan Eich?",
    correctAnswer: "JavaScript",
    options: ["Python", "Java", "JavaScript", "C++"]
  },
  {
    question: "What is the main component of the sun?",
    correctAnswer: "Hydrogen",
    options: ["Helium", "Hydrogen", "Oxygen", "Carbon"]
  },
  {
    question: "How many sides does a hexagon have?",
    correctAnswer: "6",
    options: ["5", "6", "7", "8"]
  }
];

export default function useMultipleChoiceQuizGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [questionsData, setQuestionsData] = useState<MultipleChoiceData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const currentQuestionData = questionsData[currentQuestion];
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);
  const timePerQuestion = 30;
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [isPaused, setIsPaused] = useState(false);

  // Load mock data when game opens
  useEffect(() => {
    if (gameStarted && questionsData.length === 0) {
      setQuestionsData(mockMultipleChoiceData);
    }
  }, [gameStarted, questionsData.length]);

  // Reset timer and selected answer when question changes
  useEffect(() => {
    if (gameStarted && questionsData.length > 0) {
      setSelectedAnswer("");
      setTimeLeft(timePerQuestion);
      setShowSuccess(false);
      setShowIncorrect(false);
    }
  }, [currentQuestion, gameStarted, questionsData.length]);

  // Timer countdown
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

  const handleAnswerSelect = (answer: string) => {
    if (!showSuccess && !showIncorrect) {
      setSelectedAnswer(answer);
    }
  };

  const checkAnswer = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === currentQuestionData.correctAnswer) {
      setPoints(points + 10);
      setShowSuccess(true);
      setIsPaused(true);
    } else {
      setLives(lives - 1);
      setShowIncorrect(true);
      setIsPaused(true);
    }
  };

  const nextQuestion = () => {
    setShowSuccess(false);
    setShowIncorrect(false);
    setIsPaused(false);
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
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
    setTimeLeft(timePerQuestion);
    setIsPaused(false);
    setSelectedAnswer("");
    setShowSuccess(false);
    setShowIncorrect(false);
  };

  const handleGameOpen = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuestionsData(mockMultipleChoiceData);
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return {
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
  };
} 