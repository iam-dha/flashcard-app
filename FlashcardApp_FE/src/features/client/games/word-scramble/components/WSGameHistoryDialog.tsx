import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/services/useAuth";
import { ArrowDown, ArrowUp, Calendar, ChevronRight, Clock, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGameService } from "@/services/useGameService";
import { WSGameSessionTypes } from "@/types/game.types";
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";

interface WSGameHistoryDialogProps {
  isHistoryOpen: boolean;
  setIsHistoryOpen: (isHistoryOpen: boolean) => void;
}

export default function WSGameHistoryDialog({ isHistoryOpen, setIsHistoryOpen }: WSGameHistoryDialogProps) {
  const { user } = useAuth();
  const { getWSGameHistory } = useGameService();
  const [gameHistory, setGameHistory] = useState<WSGameSessionTypes[]>([]);
  const [sortBy, setSortBy] = useState<"playAt" | "score" | "duration">("playAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (isHistoryOpen) {
      const fetchGameHistory = async () => {
        const gameHistory = await getWSGameHistory({ sortBy, sortOrder });
        setGameHistory(gameHistory);
      };
      fetchGameHistory();
    }
  }, [sortBy, sortOrder, isHistoryOpen]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ExpandableButton Icon={Trophy} label="View your game history" className="bg-accent hover:bg-accent text-accent-foreground border mx-auto" onClick={() => setIsHistoryOpen(!isHistoryOpen)} />
      </DialogTrigger>
      <DialogContent className="!h-full !w-full !max-w-none overflow-y-auto lg:!h-[80vh] lg:!w-[40vw]">
        <div className="flex flex-col gap-4">
          <div className="text-center text-2xl font-bold">Game History</div>
          <div className="text-center text-lg font-semibold">Your total score: {user?.totalScore} points</div>
          <div className="flex items-center justify-start gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hover:bg-card/50 rounded-xl">
                  <p className="">Sort by: {sortBy === "playAt" ? "Date" : sortBy === "score" ? "Score" : "Play duration"}</p>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                <DropdownMenuItem onClick={() => setSortBy("playAt")} className="hover:!bg-card/50 rounded-lg">
                  Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("score")} className="hover:!bg-card/50 rounded-lg">
                  Score
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("duration")} className="hover:!bg-card/50 rounded-lg">
                  Play duration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ExpandableButton
              Icon={sortOrder === "asc" ? ArrowUp : ArrowDown}
              label={sortOrder === "asc" ? "Ascending" : "Descending"}
              className="bg-background hover:bg-card/70 text-foreground border"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            />
          </div>
          <div className="flex flex-col gap-6">
            {gameHistory.map((game) => (
              <div key={game._id} className="bg-card/50 rounded-xl border p-4 shadow-lg transition-transform hover:scale-102">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <div className="grid cursor-pointer grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="flex flex-col items-center justify-start gap-2">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        <p className="text-lg font-bold">Score</p>
                        <p className="text-xl font-semibold">{game.score ?? "N/A"}</p>
                      </div>
                      <div className="flex flex-col items-center justify-start gap-2">
                        <Clock className="h-8 w-8 text-blue-500" />
                        <p className="text-lg font-bold">Duration</p>
                        <p className="text-xl font-semibold text-center">
                          {game.duration ?? "N/A"} {game.duration > 1 ? "seconds" : "second"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <Calendar className="h-8 w-8 text-green-500" />
                        <p className="text-lg font-bold">Date</p>
                        <p className="font-semibold">{new Date(game.playAt).toLocaleDateString("en-UK")} <br/> at {new Date(game.playAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-card/70 border-border/20 mt-4 rounded-lg border-t p-4">
                    <div className="mb-2">
                      <p className="font-semibold">Words played:</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {game.scrambledWords.map((word, idx) => (
                          <span key={idx} className="bg-muted rounded-xl px-2 py-1 text-sm">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">Correct answers:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {game.correctWords.map((word, idx) => (
                          <span key={idx} className="rounded-xl bg-green-100 px-2 py-1 text-sm text-green-700">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
