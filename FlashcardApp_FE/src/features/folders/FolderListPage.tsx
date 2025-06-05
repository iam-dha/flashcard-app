import { FolderListPageMenuBar } from "./components/FolderListPageMenuBar";
import { FolderListGridView, FolderListTableView } from "./components/FolderList";
import { useGetFolderList } from "./hooks/useGetFolderList";
import FolderListPagePagination from "./components/FolderListPagePagination";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { getPaginationParams } from "@/routes/router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutGrid, Table } from "lucide-react";

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
      <Tabs className="space-y-4" defaultValue={localStorage.getItem("folderListView") || "grid"}>
        <div className="flex items-center justify-between gap-4">
          <TabsList className="bg-card/30 h-full rounded-2xl p-1 shadow-sm">
            <TabsTrigger
              value="grid"
              onClick={() => localStorage.setItem("folderListView", localStorage.getItem("folderListView") === "grid" ? "table" : "grid")}
            >
              <LayoutGrid />
              Grid
            </TabsTrigger>
            <TabsTrigger
              value="table"
              onClick={() => localStorage.setItem("folderListView", localStorage.getItem("folderListView") === "grid" ? "table" : "grid")}
            >
              <Table />
              Table
            </TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <FolderListPageMenuBar {...folderListState} />
          </div>
        </div>
        <TabsContent value="grid">
          <div className="space-y-4">
            <FolderListGridView {...folderListState} />
            <FolderListPagePagination />
          </div>
        </TabsContent>
        <TabsContent value="table">
          <div className="space-y-4">
            <FolderListTableView {...folderListState} />
            <FolderListPagePagination />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
