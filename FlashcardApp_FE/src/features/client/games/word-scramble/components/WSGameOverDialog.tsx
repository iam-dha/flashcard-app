import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface WSGameOverDialogProps {
  points: number;
  resetGame: () => void;
}

export default function WSGameOverDialog({ points, resetGame }: WSGameOverDialogProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
      <Card className="bg-background w-80">
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
  );
}
