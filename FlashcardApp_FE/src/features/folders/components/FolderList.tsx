import { FolderTypes } from "@/types/folder.types";
import FolderCard from "./FolderCard";
import { useGetFolderList } from "../hooks/useGetFolderList";
import CustomLoader from "@/components/custom-ui/CustomLoader";

export default function FolderList({ folderList }: { folderList: FolderTypes[] }) {
  const { folderListLoading } = useGetFolderList();
  if (folderListLoading) {
    return <CustomLoader />;
  } else {
    return (
      <div className="h-auto w-full">
        <div className="grid w-full min-w-xs grid-cols-2 gap-4 lg:grid-cols-4">
          {folderList.map((folder: FolderTypes) => (
            <FolderCard key={folder.slug} folder={folder} />
          ))}
        </div>
      </div>
    );
  }
}
