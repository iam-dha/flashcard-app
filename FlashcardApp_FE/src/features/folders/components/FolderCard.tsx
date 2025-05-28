import { FolderTypes as FolderTypes } from "@/types/folder.types";
import FolderCardDropdownMenu from "./FolderCardDropdownMenu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FolderCard({ folder }: { folder: FolderTypes }) {
  return (
    <div className="bg-card text-card-foreground hover:bg-card/50 flex w-full flex-col justify-between space-y-4 rounded-xl p-4 shadow-sm">
      <Link to={`/folders/${folder.slug}`}>
        <div className="flex items-center">
          <div className="min-w-0 flex-1">
            <Button variant="link" className="-ml-4 w-full justify-start text-lg">
              <div className="block truncate overflow-hidden">{folder.name}</div>
            </Button>
          </div>
          <div className="flex-shrink-0">
            {folder.isPublic ? <Badge variant="secondary">Public</Badge> : <Badge variant="secondary">Private</Badge>}
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2 truncate">{folder.description}</p>
      </Link>
      <div className="mt-4 flex items-end justify-between object-bottom">
        <Button className="hover:bg-accent/50 text-card-foreground bg-card-foreground/10 justify-start rounded-lg">Study</Button>
        <FolderCardDropdownMenu slug={folder.slug} name={folder.name} />
      </div>
    </div>
  );
}
