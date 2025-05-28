import CustomLoader from "@/components/custom-ui/CustomLoader";
import { Button } from "@/components/ui/button";
import { useFolderService } from "@/services/useFolderService";
import { FolderTypes } from "@/types/folder.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import { DialogDescription } from "@radix-ui/react-dialog";

export function FolderList({ selectedFolder, setSelectedFolder }: { selectedFolder: string | null; setSelectedFolder: (slug: string) => void }) {
  const { getAllFolders } = useFolderService();
  const [folders, setFolders] = useState<FolderTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchFolders = async () => {
      const folders = await getAllFolders({ getAll: true });
      setFolders(folders);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchFolders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-xs grid-cols-3 gap-4 transition-all">
      {folders.map((folder: FolderTypes) => (
        <div
          key={folder.slug}
          className={`bg-accent text-card-foreground hover:bg-accent/50 flex w-full cursor-pointer flex-col space-y-4 rounded-xl p-4 shadow-sm ${selectedFolder === folder.slug ? "bg-blue-500 text-white hover:bg-blue-500/80" : ""}`}
          onClick={() => setSelectedFolder(folder.slug)}
        >
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex w-full items-center justify-start">
              <Button variant="link" className="-ml-2 max-w-full overflow-hidden text-lg" tabIndex={-1}>
                <div className="truncate overflow-hidden">{folder.name}</div>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground line-clamp-2 truncate">{folder.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function FolderPickerDialog({ word }: { word: string }) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ExpandableButton
          Icon={FolderPlus}
          label="Add to folder"
          variant="outline"
          className="hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-900/40"
        />
      </DialogTrigger>
      <DialogContent className="!max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add to folder</DialogTitle>
          <DialogDescription>
            Select a folder to add the word <strong>{word}</strong> to
          </DialogDescription>
        </DialogHeader>
        <FolderList selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} />
        <Button>Add flashcard to folder</Button>
      </DialogContent>
    </Dialog>
  );
}
