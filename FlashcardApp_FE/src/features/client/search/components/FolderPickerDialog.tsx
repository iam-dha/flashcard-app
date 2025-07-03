import CustomLoader from "@/components/custom-ui/CustomLoader";
import { Button } from "@/components/ui/button";
import { useFolderService } from "@/services/useFolderService";
import { FolderCheckResponse, FolderTypes } from "@/types/folder.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import { DialogDescription } from "@radix-ui/react-dialog";
import { FlashcardTypes } from "@/types/flashcard.types";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export function useAddToFolder(result: FlashcardTypes) {
  const { addFlashcardToFolder, getFolderBySlug, checkFlashcardInFolders } = useFolderService();
  const [addToFolderLoading, setAddToFolderLoading] = useState(false);
  const [selectedFolderSlugs, setSelectedFolderSlugs] = useState<string[]>([]);
  const [noSelectedFolderSlugs, setNoSelectedFolderSlugs] = useState<string[]>([]);
  const [isInFolders, setIsInFolders] = useState<FolderCheckResponse[]>([]);

  useEffect(() => {
    const checkIfInFolders = async (result: FlashcardTypes) => {
      try {
        const response = await checkFlashcardInFolders(result.word);
        setIsInFolders(response);

        // Pre-tick checkboxes for folders that already contain the flashcard
        const existingFolderSlugs = response.filter((item) => item.existing).map((item) => item.folder.slug);
        setSelectedFolderSlugs(existingFolderSlugs);
      } catch (error) {
        console.error("Error checking if in folders:", error);
      }
    };

    checkIfInFolders(result);
  }, [result, checkFlashcardInFolders]);

  const handleAddToFolder = async () => {
    if (selectedFolderSlugs.length === 0 && noSelectedFolderSlugs.length === 0) {
      toast.error("Please select at least one folder");
      return;
    }

    try {
      setAddToFolderLoading(true);

      const folderPromises = selectedFolderSlugs.map((slug) => getFolderBySlug(slug));
      const folders = await Promise.all(folderPromises);
      const folderNames = folders.map((folder) => folder.name);

      await addFlashcardToFolder(result.flashcardId, selectedFolderSlugs, noSelectedFolderSlugs);

      // Re-check which folders contain the flashcard after update
      const updatedResponse = await checkFlashcardInFolders(result.word);
      setIsInFolders(updatedResponse);

      // Reset to new state - pre-select folders that now contain the flashcard
      const newExistingFolderSlugs = updatedResponse.filter((item) => item.existing).map((item) => item.folder.slug);
      setSelectedFolderSlugs(newExistingFolderSlugs);
      setNoSelectedFolderSlugs([]);

      if (selectedFolderSlugs.length > 0 && selectedFolderSlugs.length !== newExistingFolderSlugs.length) {
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
      }

      if (noSelectedFolderSlugs.length > 0) {
        toast.success(`"${result.word}" removed from ${noSelectedFolderSlugs.length} folder${noSelectedFolderSlugs.length > 1 ? "s" : ""}`);
      }
    } catch (error) {
      console.error("Error adding to folders:", error);
      toast.error("Failed to add flashcard to folders");
    } finally {
      setAddToFolderLoading(false);
    }
  };

  return {
    handleAddToFolder,
    addToFolderLoading,
    selectedFolderSlugs,
    setSelectedFolderSlugs,
    noSelectedFolderSlugs,
    setNoSelectedFolderSlugs,
    isInFolders,
  };
}

export function FolderList({
  selectedFolderSlugs,
  setSelectedFolderSlugs,
  noSelectedFolderSlugs,
  setNoSelectedFolderSlugs,
  isInFolders,
}: {
  selectedFolderSlugs: string[];
  setSelectedFolderSlugs: (slugs: string[]) => void;
  noSelectedFolderSlugs: string[];
  setNoSelectedFolderSlugs: (slugs: string[]) => void;
  isInFolders: FolderCheckResponse[];
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
    const wasOriginallyInFolder = isInFolders.some((item) => item.folder.slug === folderSlug && item.existing);
    const isCurrentlySelected = selectedFolderSlugs.includes(folderSlug);

    if (wasOriginallyInFolder) {
      if (isCurrentlySelected) {
        // remove from selected, add to deselected
        setSelectedFolderSlugs(selectedFolderSlugs.filter((slug) => slug !== folderSlug));
        setNoSelectedFolderSlugs([...noSelectedFolderSlugs, folderSlug]);
      } else {
        // remove from deselected, add to selected
        setNoSelectedFolderSlugs(noSelectedFolderSlugs.filter((slug) => slug !== folderSlug));
        setSelectedFolderSlugs([...selectedFolderSlugs, folderSlug]);
      }
    } else {
      if (isCurrentlySelected) {
        // remove from selected
        setSelectedFolderSlugs(selectedFolderSlugs.filter((slug) => slug !== folderSlug));
      } else {
        // add to selected
        setSelectedFolderSlugs([...selectedFolderSlugs, folderSlug]);
      }
    }
  };

  const isAlreadyInFolder = (folderSlug: string) => {
    return isInFolders.some((item) => item.folder.slug === folderSlug && item.existing);
  };

  const isFolderSelected = (folderSlug: string) => {
    const wasOriginallyInFolder = isAlreadyInFolder(folderSlug);
    const isCurrentlySelected = selectedFolderSlugs.includes(folderSlug);
    const isCurrentlyDeselected = noSelectedFolderSlugs.includes(folderSlug);

    if (wasOriginallyInFolder) {
      return isCurrentlySelected && !isCurrentlyDeselected;
    } else {
      return isCurrentlySelected;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="custom-scrollbar max-h-[480px] overflow-y-auto">
      <div className="grid w-full min-w-xs grid-cols-3 gap-4 transition-all">
        {folders.map((folder: FolderTypes) => {
          const alreadyInFolder = isAlreadyInFolder(folder.slug);
          const isSelected = isFolderSelected(folder.slug);

          return (
            <div
              key={folder.slug}
              className={`bg-card/50 text-card-foreground hover:bg-card/80 flex w-full cursor-pointer flex-col space-y-4 rounded-xl border-2 p-4 shadow-sm transition-all ${alreadyInFolder ? (isSelected ? "border-green-500" : "border-red-500") : isSelected ? "border-blue-500" : "border-transparent"}`}
              onClick={() => handleFolderToggle(folder.slug)}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex w-full items-center justify-start">
                  <Checkbox checked={isSelected} onChange={() => handleFolderToggle(folder.slug)} className="mr-2" />
                  <Button variant="link" className="-ml-4 max-w-full overflow-hidden text-lg" tabIndex={-1}>
                    <div className="truncate overflow-hidden">{folder.name}</div>
                  </Button>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-muted-foreground line-clamp-2 truncate">{folder.description}</p>
                {alreadyInFolder &&
                  (isSelected ? (
                    <Badge className="ml-2 bg-green-500 text-white">Added</Badge>
                  ) : (
                    <Badge className="ml-2 bg-red-500 text-white">Will be removed</Badge>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FolderPickerDialog({ result }: { result: FlashcardTypes }) {
  const {
    selectedFolderSlugs,
    setSelectedFolderSlugs,
    noSelectedFolderSlugs,
    setNoSelectedFolderSlugs,
    handleAddToFolder,
    addToFolderLoading,
    isInFolders,
  } = useAddToFolder(result);

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
      <DialogContent className="!max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add to folders</DialogTitle>
          <DialogDescription>
            Select one or more folders to add the word <strong>{result.word}</strong> to
          </DialogDescription>
        </DialogHeader>

        <FolderList
          selectedFolderSlugs={selectedFolderSlugs}
          setSelectedFolderSlugs={setSelectedFolderSlugs}
          noSelectedFolderSlugs={noSelectedFolderSlugs}
          setNoSelectedFolderSlugs={setNoSelectedFolderSlugs}
          isInFolders={isInFolders}
        />

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {selectedFolderSlugs.length} folder
            {selectedFolderSlugs.length !== 1 ? "s" : ""} selected
            {noSelectedFolderSlugs.length > 0 && <span>, {noSelectedFolderSlugs.length} to remove</span>}
          </p>
          <Button
            onClick={handleAddToFolder}
            disabled={addToFolderLoading || (selectedFolderSlugs.length === 0 && noSelectedFolderSlugs.length === 0)}
          >
            {addToFolderLoading ? "Updating..." : "Update Folders"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
