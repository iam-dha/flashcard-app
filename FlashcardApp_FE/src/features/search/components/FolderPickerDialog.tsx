import CustomLoader from "@/components/custom-ui/CustomLoader";
import { Button } from "@/components/ui/button";
import { useFolderService } from "@/services/useFolderService";
import { FolderTypes } from "@/types/folder.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import { DialogDescription } from "@radix-ui/react-dialog";
import { FlashcardTypes } from "@/types/flashcard.types";
import { toast } from "sonner";

export function useAddToFolder(result: FlashcardTypes) {
  const { addFlashcardToFolder, getFolderBySlug } = useFolderService();
  const [addToFolderLoading, setAddToFolderLoading] = useState(false);
  const [selectedFolderSlug, setSelectedFolderSlug] = useState<string | undefined>(undefined);

  const handleAddToFolder = async () => {
    try {
      setAddToFolderLoading(true);
      setSelectedFolderSlug(selectedFolderSlug);
      const folder = await getFolderBySlug(selectedFolderSlug || "");
      await addFlashcardToFolder(selectedFolderSlug, result.flashcardId);
      toast.info(`"${result.word}" added to "${folder.name}"`, {
        action: {
          label: `Go to "${folder.name}"`,
          onClick: () => {
            window.location.href = `/folders/${selectedFolderSlug}`;
          },
        },
      });
    } catch (error) {
      console.error("Error adding to folder:", error);
    } finally {
      setAddToFolderLoading(false);
    }
  };

  return { handleAddToFolder, addToFolderLoading, selectedFolderSlug, setSelectedFolderSlug };
}

export function FolderList({ selectedFolderSlug, setSelectedFolderSlug }: { selectedFolderSlug?: string, setSelectedFolderSlug: (slug: string | undefined) => void }) {
  const { getAllFolders } = useFolderService();
  const [folders, setFolders] = useState<FolderTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchFolders = async () => {
      const response = await getAllFolders({ page: 1, limit: 30 });
      setFolders(response.folders);
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
    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
      <div className="grid w-full min-w-xs grid-cols-3 gap-4 transition-all">
        {folders.map((folder: FolderTypes) => (
          <div
            key={folder.slug}
            className={`bg-accent text-card-foreground hover:bg-accent/50 flex w-full cursor-pointer flex-col space-y-4 rounded-xl p-4 shadow-sm ${selectedFolderSlug === folder.slug ? "bg-blue-500 text-white hover:bg-blue-500/80" : ""}`}
            onClick={() => {
              setSelectedFolderSlug(folder.slug);
              console.log("folder slug:", folder.slug);
            }
            }
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex w-full items-center justify-start">
                <Button variant="link" className="-ml-4 max-w-full overflow-hidden text-lg" tabIndex={-1}>
                  <div className="truncate overflow-hidden">{folder.name}</div>
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-2 truncate">{folder.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FolderPickerDialog({ result }: { result: FlashcardTypes }) {
  const { selectedFolderSlug, setSelectedFolderSlug, handleAddToFolder } = useAddToFolder(result);

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
            Select a folder to add the word <strong>{result.word}</strong> to
          </DialogDescription>
        </DialogHeader>
        <FolderList selectedFolderSlug={selectedFolderSlug} setSelectedFolderSlug={setSelectedFolderSlug}/>
        <Button onClick={() => handleAddToFolder()}>Add flashcard to folder</Button>
      </DialogContent>
    </Dialog>
  );
}
