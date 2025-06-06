import { useIsMobile } from "@/hooks/useMobile";
import { Button } from "../ui/button";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

export function ExpandableButton({
  Icon,
  label,
  className = "",
  ...props
}: {
  Icon: React.ElementType;
  label: string;
  className?: string;
} & ButtonProps) {
  const isMobile = useIsMobile();
  return (
    <Button className={`group flex items-center rounded-xl transition-all duration-500 ${className}`} {...props}>
      {isMobile ? <Icon className="h-4 w-4" /> : <Icon className="-mr-2 h-4 w-4" />}
      {!isMobile && (
        <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-500 ease-in-out group-hover:ml-2 group-hover:max-w-xs group-hover:opacity-100">
          {label}
        </span>
      )}
    </Button>
  );
}
