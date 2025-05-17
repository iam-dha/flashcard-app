import CustomLoader from "@/components/custom-ui/CustomLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { folderService } from "@/services/folderService";
import { FolderTypes } from "@/types/folder.types";
import { FolderIcon, FolderUp } from "lucide-react";
import { useEffect, useState } from "react";

interface FolderPickerModalProps {
  onCancel: () => void;
  word: string;
}

export function FolderList() {
  const [folders, setFolders] = useState<FolderTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchFolders = async () => {
      const folders = await folderService.getAllFolder({ page: 1, limit: 30 });
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
    <div className="grid w-full min-w-xs grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 transition-all">
      {folders.map((folder: FolderTypes) => (
        <div key={folder.slug} className="bg-accent text-card-foreground hover:bg-accent/50 flex w-full flex-col space-y-4 rounded-xl p-4 shadow-sm">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex w-full items-center justify-start">
              <Button variant="link" className="-ml-2 max-w-full overflow-hidden text-lg">
                {folder.isPublic ? <FolderUp className="h-4 w-4" /> : <FolderIcon className="h-4 w-4" />}
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

export default function FolderPickerModal({ onCancel, word }: FolderPickerModalProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Card className="h-3xl w-3xl space-y-4 py-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Select a folder</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Choose a folder to add "{word}"</p>
        </CardHeader>

        <CardContent>
          <FolderList />
          <div className="mt-6 flex items-center justify-end gap-4">
            <Button variant="outline" className="rounded-xl" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={() => console.log("Folder selected")}>
              Add flashcard to folder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
