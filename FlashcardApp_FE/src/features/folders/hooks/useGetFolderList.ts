import { useFolderService } from "@/services/useFolderService";
import { FolderTypes } from "@/types/folder.types";
import { useCallback, useEffect, useState } from "react";
import { useFolderListRefresh } from "./useFolderListRefresh";

export function useGetFolderList() {
  const { getAllFolders } = useFolderService();
  const [folderList, setFolderList] = useState<FolderTypes[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [sort, setSort] = useState<"createdAt" | "name" | "updatedAt" | "isPublic">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [getAll, setGetAll] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [folderListLoading, setFolderListLoading] = useState(false);

  const refreshFolders = useCallback(() => {
    console.log("Refreshing folders...");
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useFolderListRefresh(refreshFolders);

  useEffect(() => {
    const fetchFolders = async () => {
      setFolderListLoading(true);
      try {
        const response = await getAllFolders({ page: page, limit: limit, sort: sort, order: order, getAll: getAll });
        setFolderList(response.folders);
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setFolderListLoading(false);
      }
    };
    if (!folderListLoading) {
      fetchFolders();
    }
  }, [getAllFolders, page, limit, sort, order, getAll, refreshTrigger]);

  return { folderList, folderListLoading, page, setPage, limit, setLimit, sort, setSort, order, setOrder, getAll, setGetAll, refreshFolders, refreshTrigger, setRefreshTrigger, totalPages };
}
