import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Heart, HelpCircle, Star, Timer, Trophy } from "lucide-react";

interface WSGameStartDialogProps {
  isLoading: boolean;
  wordsCount: number;
  timeLeft: number;
  handleGameOpen: () => void;
  handleStartGame: () => void;
}

export default function WSGameStartDialog({ isLoading, wordsCount, timeLeft, handleGameOpen, handleStartGame }: WSGameStartDialogProps) {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) handleGameOpen();
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={isLoading}>{isLoading ? "Loading..." : "Play Word Scramble"}</Button>
      </DialogTrigger>
      <DialogContent className="flex !max-w-none lg:!h-[800px] !h-full lg:!w-[1000px] !w-full flex-col border-none shadow-lg">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-blue-700">
            <Star className="h-8 w-8 text-white" />
          </div>

          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-3xl font-bold text-transparent">Word Scramble</h1>
            <p className="text-muted-foreground mt-2">Unscramble the letters to form the correct word based on the definition!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card flex items-center justify-center rounded-lg p-4 shadow-lg space-x-2">
              <HelpCircle className="h-8 w-8" />
              <div className="text-lg font-semibold">{isLoading ? "" : wordsCount} questions</div>
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
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            size="lg"
          >
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
