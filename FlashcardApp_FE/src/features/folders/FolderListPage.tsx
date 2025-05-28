import { FolderListPageMenuBar } from "./components/FolderListPageMenuBar";
import FolderList from "./components/FolderList";
import { useGetFolderList } from "./hooks/useGetFolderList";
import FolderListPagePagination from "./components/FolderListPagePagination";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { getPaginationParams } from "@/routes/router";

export default function FoldersListPage() {
  const [searchParams] = useSearchParams();
  const folderListState = useGetFolderList();

  // sync URL params with component state
  useEffect(() => {
    const { page } = getPaginationParams(searchParams);
    if (page !== folderListState.page) {
      folderListState.setPage(page);
    }
  }, [searchParams, folderListState]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FolderListPageMenuBar {...folderListState} />
        <FolderList {...folderListState} />
      </div>
      <FolderListPagePagination />
    </div>
  );
}
