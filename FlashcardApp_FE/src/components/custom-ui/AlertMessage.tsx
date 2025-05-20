import { AlertCircle, CircleCheck } from "lucide-react";

export default function AlertMessage({ type, message }: { type: "success" | "error"; message: string }) {
  if (type === "success") {
    return (
      <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-200 p-3 text-sm text-green-600 dark:bg-green-700/50 dark:text-green-500">
        <CircleCheck className="h-4 w-4" />
        {message}
      </div>
    );
  } else if (type === "error") {
    return (
      <div className="bg-destructive/20 text-destructive mt-6 flex items-center gap-2 rounded-xl p-3 text-sm">
        <AlertCircle className="h-4 w-4" />
        {message}
      </div>
    );
  }
}
