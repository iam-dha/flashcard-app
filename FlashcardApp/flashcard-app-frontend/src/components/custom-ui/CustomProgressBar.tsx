import { Badge } from "@/components/ui/badge";

export default function CustomProgressBar({ currentIndex = 0, length = 0 }) {
  const isComplete = currentIndex === length - 1;
  return (
    <>
      <div className="mb-2 flex items-center justify-center">
        <div className="flex h-2 w-full items-center rounded-full bg-blue-200">
          <div
            className={`h-2 ${isComplete ? "rounded-full" : "rounded-l"} bg-blue-500 duration-300 ease-in-out`}
            style={{
              width: `${((currentIndex + 1) / length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="mb-2 flex justify-center select-none">
        <Badge className="text-sm" variant="outline">
          {currentIndex + 1} / {length}
        </Badge>
      </div>
    </>
  );
}