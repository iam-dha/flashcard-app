import { Button } from "../ui/button";

export function ExpandableButton({
  Icon,
  label,
  variant,
  className = "",
  onClick,
}: {
  Icon: React.ElementType;
  label: string;
  variant?: "link" | "ghost" | "outline" | "default" | "destructive" | "secondary" | null | undefined;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      className={`group hover:bg-accent/50 flex items-center overflow-auto rounded-xl transition-all duration-500 ${className}`}
      variant={variant}
      onClick={onClick}
    >
      <Icon className="-mr-2 h-4 w-4" />
      <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-500 ease-in-out group-hover:ml-2 group-hover:max-w-xs group-hover:opacity-100">
        {label}
      </span>
    </Button>
  );
}