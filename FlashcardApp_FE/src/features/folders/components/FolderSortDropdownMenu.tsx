import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SortField } from "../hooks/useGetFolderList";

export default function FolderSortDropdownMenu({ sort, updateSort }: { sort: SortField; updateSort: (field: SortField) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="-mr-4 hover:-mr-2 rounded-xl">
          {sort === "createdAt" ? "Date Created" : sort === "name" ? "Name" : sort === "updatedAt" ? "Date Modified" : "Public Status"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 flex flex-col rounded-xl">
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => updateSort("name")}
        >
          Name
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => updateSort("createdAt")}
        >
          Date Created
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => updateSort("updatedAt")}
        >
          Date Modified
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => updateSort("isPublic")}
        >
          Public Status
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
