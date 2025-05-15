import { FlashcardTypes } from "@/types/flashcard.types";
import { FolderTypes } from "@/types/folder.types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mockFlashcards, mockFolders } from "@/test/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FolderDetailPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const [folder, setFolder] = useState<FolderTypes | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardTypes[]>([]);

  useEffect(() => {
    if (folderId) {
      // const selectedFolder = mockFolders.find((folder: FolderTypes) => folder.folderId === folderId);
      // setFolder(selectedFolder || null);
      setFlashcards(mockFlashcards[folderId] || []);
    }
  }, [folderId]);

  if (!folder) {
    return <div className="flex h-full items-center justify-center">Folder not found</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">{folder.description}</p>
        <Link to={`/folders/${folderId}/study`}>
          <Button className="bg-accent text-card-foreground hover:bg-accent/50">Study</Button>
        </Link>
      </div>
      {flashcards.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {flashcards.map((flashcard) => (
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p>{flashcard.word}</p>
                  <Badge variant="outline" className="select-none">
                    {flashcard.wordType}
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm">{flashcard.definition[0]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground">No flashcards in this folder</div>
      )}
    </div>
  );
}
