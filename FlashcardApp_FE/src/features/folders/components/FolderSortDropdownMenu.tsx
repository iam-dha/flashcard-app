import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SortField } from "../hooks/useGetFolderList";
import { useIsMobile } from "@/hooks/useMobile";
import {CalendarClock, FolderPen, CalendarArrowUp, FolderLock } from "lucide-react";

export default function FolderSortDropdownMenu({ sort, updateSort }: { sort: SortField; updateSort: (field: SortField) => void }) {
  const isMobile = useIsMobile();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="-mr-4 rounded-xl hover:-mr-2">
          {sort === "createdAt" && <CalendarClock className="h-4 w-4" />}
          {sort === "name" && <FolderPen className="h-4 w-4" />}
          {sort === "updatedAt" && <CalendarArrowUp className="h-4 w-4" />}
          {sort === "isPublic" && <FolderLock className="h-4 w-4" />}
          {!isMobile && (sort === "createdAt" ? "Date Created" : sort === "name" ? "Name" : sort === "updatedAt" ? "Date Modified" : "Public Status")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 flex flex-col rounded-xl">
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => updateSort("name")}
        >
          <FolderPen className="h-4 w-4" />
          Name
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => updateSort("createdAt")}
        >
          <CalendarClock className="h-4 w-4" />
          Date Created
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => updateSort("updatedAt")}
        >
          <CalendarArrowUp className="h-4 w-4" />
          Date Modified
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => updateSort("isPublic")}
        >
          <FolderLock className="h-4 w-4" />
          Public Status
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
