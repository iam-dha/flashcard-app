import { FolderTypes } from "@/types/folder.types";
import FolderCard from "./components/FolderCard";
import FoldersPageMenuBar from "./components/FoldersPageMenuBar";
import { folderService } from "@/services/folderService";
import { useEffect, useState } from "react";

export default function FoldersPage() {
  const [folders, setFolders] = useState<FolderTypes[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await folderService.getAllFolder({ page: 1, limit: 30 });
      setFolders(folders);
    };
    fetchFolders();
  }, []);

  return (
    <div>
      <FoldersPageMenuBar />
      <div className="min-h-screen w-full">
        <div className="grid w-full min-w-xs grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {folders.map((folder: FolderTypes) => (
            <FolderCard folder={folder} />
          ))}
        </div>
      </div>
    </div>
  );
}
