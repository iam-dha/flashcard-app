import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { WordScrambleData } from "../useWordScrambleGame";

interface WSGameSuccessDialogProps {
  nextQuestion: () => void;
  currentQuestion: number;
  wordsData: WordScrambleData[];
}

export default function WSGameSuccessDialog({ nextQuestion, currentQuestion, wordsData }: WSGameSuccessDialogProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
      <Card className="bg-background w-80">
        <CardContent className="space-y-4 p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Trophy className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-600">Congratulations!</h3>
            <p className="text-muted-foreground mt-1">You got it right! +10 points</p>
          </div>
          <Button onClick={nextQuestion} className="w-full bg-green-500 hover:bg-green-600">
            {currentQuestion < wordsData.length - 1 ? "Next Question" : "Finish Game"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
