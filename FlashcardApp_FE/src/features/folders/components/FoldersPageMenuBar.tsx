import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, FolderPlus, Share, Trash, ArrowUp, ArrowDown } from "lucide-react";
import CreateFolderCard from "./FolderCreateCard"; // Import the form

function FoldersPageMenuButton({
  Icon,
  label,
  className = "",
  onClick,
}: {
  Icon: React.ElementType;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      className={`group hover:bg-accent/50 flex items-center overflow-auto rounded-xl transition-all duration-500 ${className}`}
      variant="ghost"
      onClick={onClick}
    >
      <Icon className="-mr-2 h-4 w-4" />
      <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-500 ease-in-out group-hover:ml-2 group-hover:max-w-xs group-hover:opacity-100">
        {label}
      </span>
    </Button>
  );
}

function SortButton() {
  const [isAscending, setIsAscending] = useState(() => {
    const stored = localStorage.getItem("folders-sort-asc");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("folders-sort-asc", String(isAscending));
  }, [isAscending]);

  return (
    <Button
      className="group hover:bg-accent/50 flex items-center overflow-auto rounded-xl transition-all duration-700"
      variant="ghost"
      onClick={() => setIsAscending(!isAscending)}
    >
      {isAscending ? <ArrowUp className="-mr-2 h-4 w-4" /> : <ArrowDown className="-mr-2 h-4 w-4" />}
      <span
        className={`max-w-0 overflow-hidden opacity-0 transition-all duration-700 ease-in-out group-hover:ml-2 group-hover:max-w-xs group-hover:opacity-100`}
      >
        {isAscending ? "Ascending order" : "Descending order"}
      </span>
    </Button>
  );
}

export default function FoldersPageMenuBar() {
  const [showCreateCard, setShowCreate] = useState(false);

  return (
    <>
      <div className="frosted-glass sticky top-20 z-10 mb-4 flex h-max justify-between rounded-xl border p-1 md:mb-6">
        <div className="flex">
          <FoldersPageMenuButton Icon={FolderPlus} label="New Folder" onClick={() => setShowCreate(true)} />
          <FoldersPageMenuButton Icon={Share} label="Share" />
          <FoldersPageMenuButton Icon={Trash} className="hover:bg-red-200 hover:text-red-500 dark:hover:bg-red-900/40" label="Delete folder" />
          <FoldersPageMenuButton Icon={EllipsisVertical} label="More" />
        </div>
        <div>
          <SortButton />
        </div>
      </div>
      {showCreateCard && (
        <div className="frosted-glass fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-black/30" onClick={() => setShowCreate(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateFolderCard />
              <div className="object-bottom-right">
                <Button variant="outline" onClick={() => setShowCreate(false)}>
                  Close
                </Button>
              </div>
          </div>
        </div>
      )}
    </>
  );
}
