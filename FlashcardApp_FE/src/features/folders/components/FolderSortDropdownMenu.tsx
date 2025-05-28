import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

interface FolderSortDropdownMenuProps {
  sort: "createdAt" | "name" | "updatedAt" | "isPublic";
  setSort: React.Dispatch<React.SetStateAction<"createdAt" | "name" | "updatedAt" | "isPublic">>;
}

export default function FolderSortDropdownMenu({ sort, setSort }: FolderSortDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="-mr-4">
          {sort === "createdAt" ? "Date Created" : sort === "name" ? "Name" : sort === "updatedAt" ? "Date Modified" : "Public Status"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 flex flex-col rounded-xl">
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => setSort("name")}
        >
          Name
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => setSort("createdAt")}
        >
          Date Created
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => setSort("updatedAt")}
        >
          Date Modified
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent"
          onClick={() => setSort("isPublic")}
        >
          Public Status
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
