import { useFolderService } from "@/services/useFolderService";
import { FolderTypes } from "@/types/folder.types";
import { useCallback, useEffect, useState } from "react";
import { useFolderListRefresh } from "./useFolderListRefresh";
import { useSearchParams } from "react-router-dom";

export type SortField = "createdAt" | "name" | "updatedAt" | "isPublic";
export type SortOrder = "asc" | "desc";

export function useGetFolderList() {
  const { getAllFolders } = useFolderService();
  const [searchParams, setSearchParams] = useSearchParams();
  const [folderList, setFolderList] = useState<FolderTypes[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [getAll, setGetAll] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [folderListLoading, setFolderListLoading] = useState(false);

  const sort = (searchParams.get("sort") as SortField) || "createdAt";
  const order = (searchParams.get("order") as SortOrder) || "desc";

  const updateSort = useCallback(
    (field: SortField) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("sort", field);
        return newParams;
      });
    },
    [setSearchParams],
  );

  const toggleSortOrder = useCallback(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      const currentOrder = (prev.get("order") as SortOrder) || "desc";
      newParams.set("order", currentOrder === "asc" ? "desc" : "asc");
      return newParams;
    });
  }, [setSearchParams]);

  const refreshFolders = useCallback(() => {
    console.log("Refreshing folders...");
    setRefreshTrigger((prev) => prev + 1);
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

  return {
    folderList,
    folderListLoading,
    page,
    setPage,
    limit,
    setLimit,
    sort,
    updateSort,
    order,
    toggleSortOrder,
    getAll,
    setGetAll,
    refreshFolders,
    totalPages,
  };
}
