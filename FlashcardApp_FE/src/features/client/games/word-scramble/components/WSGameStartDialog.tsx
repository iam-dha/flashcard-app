import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Heart, HelpCircle, Play, Timer, Trophy } from "lucide-react";
import { WSGameBackground } from "../../GamesPage";
import { useState } from "react";
import WSGameHistoryDialog from "./WSGameHistoryDialog";

interface WSGameStartDialogProps {
  isLoading: boolean;
  wordsCount: number;
  timeLeft: number;
  handleGameOpen: () => void;
  handleStartGame: () => void;
}

export default function WSGameStartDialog({ isLoading, wordsCount, timeLeft, handleGameOpen, handleStartGame }: WSGameStartDialogProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) handleGameOpen();
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={isLoading}>{isLoading ? "Loading..." : "Play Word Scramble"}</Button>
      </DialogTrigger>
      <DialogContent className="flex !h-full !w-full !max-w-none flex-col border-none shadow-lg lg:!h-[80vh] lg:!w-[60vw]">
        <div className="flex h-full flex-col space-y-4 text-center">
          <div className="mt-4">
            <h1 className="bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-3xl font-bold text-transparent">Word Scramble</h1>
            <p className="text-muted-foreground mt-2">Unscramble the letters to form the correct word based on the definition!</p>
          </div>

          <WSGameBackground />

          <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="bg-card/50 flex items-center justify-center space-x-2 rounded-lg p-4 shadow-lg">
              <HelpCircle className="h-8 w-8" />
              <div className="text-lg font-semibold">{isLoading ? "" : wordsCount} questions</div>
            </div>

            <div className="bg-card/50 flex items-center justify-center space-x-2 rounded-lg p-4 shadow-lg">
              <Heart className="h-8 w-8" />
              <div className="text-lg font-semibold">3 lives</div>
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

          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={handleStartGame}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 font-semibold hover:from-blue-600 hover:to-blue-800"
            >
              <Play className="h-8 w-8" />
              Start Game
            </Button>
            <WSGameHistoryDialog isHistoryOpen={isHistoryOpen} setIsHistoryOpen={setIsHistoryOpen} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
