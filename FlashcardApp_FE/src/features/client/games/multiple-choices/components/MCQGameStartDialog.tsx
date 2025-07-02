import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { HelpCircle, Heart, Timer, Trophy, Play } from "lucide-react";
import { MCQGameBackground } from "../../GamesPage";

interface MCQGameStartDialogProps {
  isLoading: boolean;
  questionsCount: number;
  numberOfLives: number;
  timeLeft: number;
  handleGameOpen: () => void;
  handleStartGame: () => void;
}

export default function MCQGameStartDialog({ isLoading, questionsCount, numberOfLives, timeLeft, handleGameOpen, handleStartGame }: MCQGameStartDialogProps) {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) handleGameOpen();
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={isLoading}>{isLoading ? "Loading..." : "Play Multiple Choice Quiz"}</Button>
      </DialogTrigger>
      <DialogContent className="flex !h-full !w-full !max-w-none flex-col border-none shadow-lg lg:!h-[600px] lg:!w-[800px]">
        <div className="flex h-full flex-col space-y-4">
          <div className="mt-4 text-center">
            <h1 className="bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-3xl font-bold text-transparent">Multiple Choice</h1>
            <p className="text-muted-foreground mt-2">Choose the correct answer from the four options provided!</p>
          </div>

          <div className="flex items-center justify-center">
            <MCQGameBackground />
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4 text-center lg:grid-cols-4">
            <div className="bg-card/50 flex items-center justify-center space-x-2 rounded-lg p-4 shadow-lg">
              <HelpCircle className="h-8 w-8" />
              <div className="text-lg font-semibold">{isLoading ? "" : questionsCount} questions</div>
            </div>

            <div className="bg-card/50 flex items-center justify-center space-x-2 rounded-lg p-4 shadow-lg">
              <Heart className="h-8 w-8" />
              <div className="text-lg font-semibold">{numberOfLives} lives</div>
            </div>

            <div className="bg-card/50 flex items-center justify-center space-x-2 rounded-lg p-4 shadow-lg">
              <Timer className="h-8 w-8" />
              <div className="text-lg font-semibold">{timeLeft}s per question</div>
            </div>

            <div className="bg-card/50 flex items-center justify-center space-x-2 rounded-lg p-4 shadow-lg">
              <Trophy className="h-8 w-8" />
              <div className="text-lg font-semibold">10 points per correct answer</div>
            </div>
          </div>

          <Button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-xl font-semibold"
          >
            <Play className="h-8 w-8" />
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
