import { FlashcardTypes } from "@/types/flashcard.types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFolderService } from "@/services/useFolderService";
import { FolderTypes } from "@/types/folder.types";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import Flashcard from "../flashcards/Flashcard";
import { Button } from "@/components/ui/button";
import { GraduationCap, FolderPlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function FolderDetailPage() {
  const { getFolderFlashcardList, getFolderBySlug, addFlashcardToFolder, getAllFolders } = useFolderService();
  const { slug } = useParams<{ slug: string }>();
  const [folder, setFolder] = useState<FolderTypes>();
  const [flashcards, setFlashcards] = useState<FlashcardTypes[]>([]);
  const [loading, setLoading] = useState(true);

  // multi-select state
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedFlashcardIds, setSelectedFlashcardIds] = useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // folder selection for dialog
  const [selectedFolderSlugs, setSelectedFolderSlugs] = useState<string[]>([]);
  const [folders, setFolders] = useState<FolderTypes[]>([]);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchFolderData = async () => {
      try {
        const response = await getFolderFlashcardList(slug as string);
        const folder = await getFolderBySlug(slug as string);
        setFolder(folder);
        setFlashcards(response.flashcards);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };

    fetchFolderData();
  }, [slug]);

  useEffect(() => {
    if (addDialogOpen) {
      getAllFolders({ page: 1, limit: 30 }).then((res) => setFolders(res.folders));
    }
  }, [addDialogOpen, getAllFolders]);

  const handleFlashcardToggle = (flashcardId: string) => {
    const newSelectedFlashcardIds = [...selectedFlashcardIds];
    newSelectedFlashcardIds.includes(flashcardId)
      ? newSelectedFlashcardIds.splice(newSelectedFlashcardIds.indexOf(flashcardId), 1)
      : newSelectedFlashcardIds.push(flashcardId);
    setSelectedFlashcardIds(newSelectedFlashcardIds);
    console.log(newSelectedFlashcardIds);
  };

  const handleSelectAll = () => {
    if (selectedFlashcardIds.length === flashcards.length) {
      setSelectedFlashcardIds([]);
    } else {
      setSelectedFlashcardIds(flashcards.map((f) => f.flashcardId));
    }
  };

  const handleFolderToggle = (folderSlug: string) => {
    const newSelectedFolderSlugs = [...selectedFolderSlugs];
    newSelectedFolderSlugs.includes(folderSlug)
      ? newSelectedFolderSlugs.splice(newSelectedFolderSlugs.indexOf(folderSlug), 1)
      : newSelectedFolderSlugs.push(folderSlug);
    setSelectedFolderSlugs(newSelectedFolderSlugs);
  };

  const handleAddToFolders = async () => {
    if (selectedFolderSlugs.length === 0) {
      toast.error("Please select at least one folder");
      return;
    }
    setAddLoading(true);
    try {
      await Promise.all(selectedFlashcardIds.map((flashcardId) => addFlashcardToFolder(flashcardId, selectedFolderSlugs)));
      toast.success(`Added ${selectedFlashcardIds.length} flashcard(s) to ${selectedFolderSlugs.length} folder(s)`);
      setAddDialogOpen(false);
      setSelectedFlashcardIds([]);
      setSelectedFolderSlugs([]);
    } catch (error) {
      toast.error("Failed to add flashcards to folders");
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="">{folder?.description}</p>
        <div className="flex gap-2">
          <Button
            className="hover:bg-accent/80 bg-accent text-accent-foreground justify-start rounded-2xl shadow-sm hover:scale-105"
            onClick={() => (window.location.href = `/folders/${folder?.slug}/study`)}
          >
            <GraduationCap className="h-4 w-4" />
            Study
          </Button>
          <Button
            variant="outline"
            className="justify-start rounded-2xl shadow-sm hover:scale-105"
            onClick={() => {
              setMultiSelectMode(!multiSelectMode);
              setSelectedFlashcardIds([]);
            }}
          >
            {multiSelectMode ? "Cancel Multi-Select" : "Multi-Select"}
          </Button>
          {multiSelectMode && (
            <Button
              variant="outline"
              disabled={selectedFlashcardIds.length === 0}
              onClick={() => setAddDialogOpen(true)}
              className="hover:bg-accent/80 bg-accent text-accent-foreground justify-start rounded-2xl shadow-sm hover:scale-105"
            >
              <FolderPlus className="mr-1 h-4 w-4" />
              Add to Folders
            </Button>
          )}
        </div>
      </div>
      {multiSelectMode && (
        <div className="flex items-center gap-4">
          <Checkbox checked={selectedFlashcardIds.length === flashcards.length && flashcards.length > 0} onCheckedChange={handleSelectAll} />
          <span>{selectedFlashcardIds.length} selected</span>
        </div>
      )}
      <p className="text-xl font-bold">Flashcard List</p>
      {flashcards.length === 0 ? (
        <p>There are no flashcards in this folder. Try to add some using search!</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {flashcards.map((flashcard) => {
            const isSelected = selectedFlashcardIds.includes(flashcard.flashcardId);
            return (
              <div
                key={flashcard.flashcardId}
                className={`group relative ${multiSelectMode ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (multiSelectMode) {
                    handleFlashcardToggle(flashcard.flashcardId);
                  }
                }}
              >
                <Flashcard {...flashcard} />
                {multiSelectMode && (
                  <div
                    className={`absolute inset-0 rounded-2xl transition-all duration-200 ${
                      isSelected ? "bg-blue-500/20 ring-2 ring-blue-500 ring-offset-2" : "hover:bg-accent/10"
                    }`}
                  >
                    <div className="absolute top-2 left-2 z-10 rounded-full bg-white/90 p-1 shadow-sm">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleFlashcardToggle(flashcard.flashcardId)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add to Folders Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add selected flashcards to folders</DialogTitle>
            <DialogDescription>Select one or more folders to add the selected flashcards to.</DialogDescription>
          </DialogHeader>
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
                      <Checkbox
                        checked={selectedFolderSlugs.includes(folder.slug)}
                        onChange={() => handleFolderToggle(folder.slug)}
                        className="mr-2"
                      />
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
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {selectedFolderSlugs.length} folder{selectedFolderSlugs.length !== 1 ? "s" : ""} selected
            </p>
            <Button onClick={handleAddToFolders} disabled={addLoading || selectedFolderSlugs.length === 0 || selectedFlashcardIds.length === 0}>
              {addLoading ? "Adding..." : `Add to ${selectedFolderSlugs.length} folder${selectedFolderSlugs.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
