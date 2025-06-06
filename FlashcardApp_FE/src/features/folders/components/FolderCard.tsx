import { FolderTypes as FolderTypes } from "@/types/folder.types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Users, GraduationCap } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, PencilLine, Share, Trash } from "lucide-react";
import DeleteFolderCard from "./FolderDeleteDialog";

interface FolderCardDropdownMenuProps {
  slug: string;
  name: string;
}

export function FolderCardDropdownMenu({ slug, name }: FolderCardDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-card-foreground hover:bg-accent/50 -mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-transparent hover:ml-2 transition-all duration-200">
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-popover mt-2 flex flex-col rounded-xl border border-transparent shadow-lg">
        <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
          <PencilLine />
          Rename
        </Button>
        <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
          <Share />
          Share
        </Button>
        <DeleteFolderCard
          trigger={
            <Button variant="ghost" className="hover:bg-destructive/20 justify-start rounded-lg bg-transparent">
              <Trash className="text-red-500" />
              <p className="text-red-500">Delete</p>
            </Button>
          }
          slug={slug}
          name={name}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function FolderCard({ folder }: { folder: FolderTypes }) {
  return (
    <div className="group relative w-full perspective-[1000px]">
      {/* Folder tab */}
      <div className="bg-card border-border/50 absolute -top-6 z-10 h-12 w-28 rounded-t-lg border shadow-md"></div>

      {/* Main folder body with 3D hover effect */}
      <div className="bg-card text-card-foreground border-border/50 relative z-30 flex w-full transform flex-col justify-between rounded-xl border shadow-md transition-all duration-300 ease-in-out group-hover:-rotate-x-15 group-hover:shadow-xl">
        <Link to={`/folders/${folder.slug}`} className="flex flex-grow flex-col gap-4 px-4 pt-4 pb-10" title={folder.name}>
          <div className="flex flex-col overflow-hidden">
            <Button variant="link" className="-ml-4 w-full justify-start text-lg font-medium cursor-pointer">
              <div className="block truncate overflow-hidden">{folder.name}</div>
            </Button>
            <p className="line-clamp-2 truncate overflow-hidden">
              {folder.description ? folder.description : <p className="text-muted-foreground">No description</p>}
            </p>
          </div>
        </Link>
        <div className="flex items-end justify-between p-4">
          <Link to={`/folders/${folder.slug}`} className="flex flex-shrink-0 gap-2">
            <Badge variant="secondary" title="Flashcards in this folder">
              {folder.flashcardCount > 2 ? folder.flashcardCount + " flashcards" : folder.flashcardCount + " flashcard"}
            </Badge>
            {folder.isPublic ? (
              <Badge variant="secondary" className="bg-green-200 text-green-800" title="Public folder">
                <Users />
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-blue-300 text-blue-800" title="Private folder">
                <User />
              </Badge>
            )}
          </Link>
          <div className="flex items-center">
            <Button
              className="hover:bg-accent/80 bg-accent text-accent-foreground justify-start rounded-xl shadow-sm hover:scale-105"
              onClick={() => (window.location.href = `/folders/${folder.slug}/study`)}
            >
              <GraduationCap className="h-4 w-4" />
              Study
            </Button>
            <FolderCardDropdownMenu slug={folder.slug} name={folder.name} />
          </div>
        </div>
      </div>
      {/* Paper inside the folder */}
      <div className="absolute top-0 right-0 left-0 z-20 mx-auto h-32 w-[90%] translate-y-2 scale-[.98] rounded-md bg-gray-200 shadow-sm transition-all duration-300 ease-in-out group-hover:-translate-y-3" />
    </div>
  );
}
