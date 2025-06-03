import { FolderTypes as FolderTypes } from "@/types/folder.types";
import FolderCardDropdownMenu from "./FolderCardDropdownMenu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FolderCard({ folder }: { folder: FolderTypes }) {
  return (
    <div className="group relative w-full perspective-[1000px]">
      {/* Folder tab */}
      <div
        className="bg-card border-border/50 absolute -top-6 z-10 h-12 w-28 rounded-t-lg border shadow-md"
        style={{
          clipPath: "polygon(0 100%, 100%, 100% 0, 15% 0, 10% 30%, 0 30%)",
        }}
      ></div>

      {/* Main folder body with 3D hover effect */}
      <div className="bg-card text-card-foreground border-border/50 relative z-30 flex w-full transform flex-col justify-between space-y-4 rounded-xl border p-5 shadow-md transition-all duration-300 ease-in-out group-hover:-rotate-x-15 group-hover:shadow-xl">
        <Link to={`/folders/${folder.slug}`} className="flex flex-grow flex-col" title={folder.name}>
          <div className="flex items-center">
            <div className="min-w-0 flex-1">
              <Button variant="link" className="-ml-4 w-full justify-start text-lg font-medium">
                <div className="block truncate overflow-hidden">{folder.name}</div>
              </Button>
            </div>
            <div className="flex-shrink-0">
              {folder.isPublic ? (
                <Badge variant="secondary" className="bg-muted">
                  Public
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted">
                  Private
                </Badge>
              )}
            </div>
          </div>
          <p className="line-clamp-2 min-h-[2.5rem]">{folder.description}</p>
        </Link>
        <div className="mt-4 flex items-end justify-between">
          <Button className="hover:bg-accent/80 bg-accent text-accent-foreground justify-start rounded-2xl shadow-sm" onClick={() => window.location.href = `/folders/${folder.slug}/study`}>
            Study
          </Button>
          <FolderCardDropdownMenu slug={folder.slug} name={folder.name} />
        </div>
      </div>
      {/* Paper inside the folder */}
      <div className="absolute top-0 right-0 left-0 z-20 mx-auto h-32 w-[90%] translate-y-2 scale-[.98] rounded-md bg-gray-200 shadow-sm transition-all duration-300 ease-in-out group-hover:-translate-y-3" />
    </div>
  );
}
