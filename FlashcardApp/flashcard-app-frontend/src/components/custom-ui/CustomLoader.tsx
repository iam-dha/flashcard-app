import { Loader2 } from "lucide-react";

export default function CustomLoader() {
  return (
    <div className="mt-8 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
