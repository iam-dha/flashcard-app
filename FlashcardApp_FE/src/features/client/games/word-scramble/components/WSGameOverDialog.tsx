import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import WSGameHistoryDialog from "./WSGameHistoryDialog";
import { useState } from "react";

interface WSGameOverDialogProps {
  points: number;
  resetGame: () => void;
}

export default function WSGameOverDialog({ points, resetGame }: WSGameOverDialogProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
      <Card className="bg-background w-[500px]">
        <CardContent className="space-y-4 p-6 text-center">
          <p className="text-foreground text-xl font-bold">Game Over!</p>
          <p className="text-foreground">Final Score: {points} points</p>
          <div className="flex justify-between gap-2">
            <Button onClick={resetGame} className="flex-1 rounded-xl">
              Back to Game Menu
            </Button>
            <WSGameHistoryDialog isHistoryOpen={isHistoryOpen} setIsHistoryOpen={setIsHistoryOpen} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
