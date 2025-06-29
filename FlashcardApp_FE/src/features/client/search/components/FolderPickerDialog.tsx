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
import { Checkbox } from "@/components/ui/checkbox";

export function useAddToFolder(result: FlashcardTypes) {
  const { addFlashcardToFolder, getFolderBySlug, checkFlashcardInFolders } = useFolderService();
  const [addToFolderLoading, setAddToFolderLoading] = useState(false);
  const [selectedFolderSlugs, setSelectedFolderSlugs] = useState<string[]>([]);
  const [isInFolders, setIsInFolders] = useState<boolean>(false);
  useEffect(() => {
    try {
      const checkIfInFolders = async (result: FlashcardTypes) => {
        const response = await checkFlashcardInFolders(result.word);
        setIsInFolders(response);
      };

      checkIfInFolders(result);
    } catch (error) {
      console.error("Error checking if favourites:", error);
    }
  }, [result]);

  const handleAddToFolder = async () => {
    if (selectedFolderSlugs.length === 0) {
      toast.error("Please select at least one folder");
      return;
    }

    try {
      setAddToFolderLoading(true);

      const folderPromises = selectedFolderSlugs.map((slug) => getFolderBySlug(slug));
      const folders = await Promise.all(folderPromises);
      const folderNames = folders.map((folder) => folder.name);

      await addFlashcardToFolder(result.flashcardId, selectedFolderSlugs);

      toast.success(
        `"${result.word}" added to ${selectedFolderSlugs.length} folder${selectedFolderSlugs.length > 1 ? "s" : ""}: ${folderNames.join(", ")}`,
        {
          action: {
            label: "View folders",
            onClick: () => {
              window.location.href = `/folders`;
            },
          },
        },
      );

      setSelectedFolderSlugs([]); // clear selections after successful addition
    } catch (error) {
      console.error("Error adding to folders:", error);
      toast.error("Failed to add flashcard to folders");
    } finally {
      setAddToFolderLoading(false);
    }
  };

  return { handleAddToFolder, addToFolderLoading, selectedFolderSlugs, setSelectedFolderSlugs };
}

export function FolderList({
  selectedFolderSlugs,
  setSelectedFolderSlugs,
}: {
  selectedFolderSlugs: string[];
  setSelectedFolderSlugs: (slugs: string[]) => void;
}) {
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

  const handleFolderToggle = (folderSlug: string) => {
    const newSelectedFolderSlugs = [...selectedFolderSlugs];
    newSelectedFolderSlugs.includes(folderSlug)
      ? newSelectedFolderSlugs.splice(newSelectedFolderSlugs.indexOf(folderSlug), 1)
      : newSelectedFolderSlugs.push(folderSlug);
    setSelectedFolderSlugs(newSelectedFolderSlugs);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="custom-scrollbar max-h-[400px] overflow-y-auto">
      <div className="grid w-full min-w-xs grid-cols-3 gap-4 transition-all">
        {folders.map((folder: FolderTypes) => (
          <div
            key={folder.slug}
            className={`bg-card/50 text-card-foreground hover:bg-card/80 flex w-full cursor-pointer flex-col space-y-4 rounded-xl p-4 shadow-sm ${
              selectedFolderSlugs.includes(folder.slug) ? "bg-blue-500 text-white hover:bg-blue-500/80" : ""
            }`}
            onClick={() => handleFolderToggle(folder.slug)}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex w-full items-center justify-start">
                <Checkbox checked={selectedFolderSlugs.includes(folder.slug)} onChange={() => handleFolderToggle(folder.slug)} className="mr-2" />
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
  const { selectedFolderSlugs, setSelectedFolderSlugs, handleAddToFolder, addToFolderLoading } = useAddToFolder(result);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ExpandableButton
          Icon={FolderPlus}
          label="Add to folder"
          variant="outline"
          className="border-transparent hover:bg-blue-200 hover:text-blue-500 dark:hover:bg-blue-900/80 dark:hover:text-blue-500"
        />
      </DialogTrigger>
      <DialogContent className="!max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add to folders</DialogTitle>
          <DialogDescription>
            Select one or more folders to add the word <strong>{result.word}</strong> to
          </DialogDescription>
        </DialogHeader>

        <FolderList selectedFolderSlugs={selectedFolderSlugs} setSelectedFolderSlugs={setSelectedFolderSlugs} />

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {selectedFolderSlugs.length} folder{selectedFolderSlugs.length !== 1 ? "s" : ""} selected
          </p>
          <Button onClick={handleAddToFolder} disabled={addToFolderLoading || selectedFolderSlugs.length === 0}>
            {addToFolderLoading ? "Adding..." : `Add to ${selectedFolderSlugs.length} folder${selectedFolderSlugs.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
