import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Play, Pause, Trophy } from "lucide-react";

interface WSGameHeaderProps {
  lives: number;
  points: number;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
}

export default function WSGameHeader({ lives, points, isPaused, setIsPaused }: WSGameHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        {/* Lives */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className={`h-8 w-8 ${i < lives ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
          ))}
        </div>

        {/* Points */}
        <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
          <Trophy className="mr-1 h-8 w-8" />
          <p className="text-lg">{points} points</p>
        </Badge>
      </div>

      {/* Pause Button */}
      <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </Button>
    </div>
  );
}
