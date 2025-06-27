import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function CustomBackButton() {
  return (
    <Button
      className="flex items-center justify-center rounded-full text-foreground hover:bg-card/50 liquid-glass"
      variant="ghost"
      onClick={() => window.history.back()}
      aria-label="Go back"
    >
      <ChevronLeft style={{ width: "20px", height: "20px" }} />
    </Button>
  );
}
