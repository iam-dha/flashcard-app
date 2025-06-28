import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { HelpCircle, Heart, Timer, Trophy } from "lucide-react";

interface MCGameStartDialogProps {
  isLoading: boolean;
  questionsCount: number;
  timeLeft: number;
  handleGameOpen: () => void;
  handleStartGame: () => void;
}

export default function MCGameStartDialog({ isLoading, questionsCount, timeLeft, handleGameOpen, handleStartGame }: MCGameStartDialogProps) {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) handleGameOpen();
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={isLoading}>{isLoading ? "Loading..." : "Play Multiple Choice Quiz"}</Button>
      </DialogTrigger>
      <DialogContent className="flex h-fit max-w-md flex-col border-none shadow-lg">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-300 to-green-700">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>

          <div>
            <h1 className="bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-3xl font-bold text-transparent">Multiple Choice</h1>
            <p className="text-muted-foreground mt-2">Choose the correct answer from the four options provided!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card flex items-center justify-center rounded-lg p-4 shadow-lg space-x-2">
              <HelpCircle className="h-8 w-8" />
              <div className="text-lg font-semibold">{isLoading ? "" : questionsCount} questions</div>
            </div>

            <div className="bg-card flex items-center justify-center rounded-lg p-4 shadow-lg space-x-2">
              <Heart className="h-8 w-8" />
              <div className="text-lg font-semibold">3 lives</div>
            </div>

            <div className="bg-card flex items-center justify-center rounded-lg p-4 shadow-lg space-x-2">
              <Timer className="h-8 w-8" />
              <div className="text-lg font-semibold">{timeLeft}s per question</div>
            </div>

            <div className="bg-card flex items-center justify-center rounded-lg p-4 shadow-lg space-x-2">
              <Trophy className="h-8 w-8" />
              <div className="text-lg font-semibold">10 points per correct answer</div>
            </div>
          </div>

          <Button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
            size="lg"
          >
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
