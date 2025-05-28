import { FlashcardTypes } from "@/types/flashcard.types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useFolderService } from "@/services/useFolderService";
import { FolderTypes } from "@/types/folder.types";
import CustomLoader from "@/components/custom-ui/CustomLoader";

export default function FolderDetailPage() {
  const { getFolderFlashcardList, getFolderBySlug } = useFolderService();
  const { slug } = useParams<{ slug: string }>();
  const [folder, setFolder] = useState<FolderTypes>();
  const [flashcards, setFlashcards] = useState<FlashcardTypes[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="space-y-4">
      <p className="">{folder?.description}</p>
      <p className="text-xl font-bold">Flashcard List</p>
      {flashcards.length === 0 ? (
        <p>There are no flashcards in this folder. Try to add some using search!</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {flashcards.map((flashcard) => (
            <Card key={flashcard.word} className="mb-4 w-full py-4">
              <CardContent>
                <h3 className="text-lg font-semibold">{flashcard.word}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
