import { EllipsisVertical, Share, Trash, ArrowUp, ArrowDown } from "lucide-react"; // Import the form
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import CreateFolderCard from "./FolderCreateDialog";
import FolderSortDropdownMenu from "./FolderSortDropdownMenu";
import { SortField, SortOrder } from "../hooks/useGetFolderList";

interface FolderListPageMenuBarProps {
  sort: "createdAt" | "name" | "updatedAt" | "isPublic";
  updateSort: (field: SortField) => void;
  order: "asc" | "desc";
  toggleSortOrder: () => void;
}

function OrderButton({ order, toggleSortOrder }: { order: SortOrder; toggleSortOrder: () => void }) {
  return (
    <ExpandableButton
      Icon={order === "asc" ? ArrowUp : ArrowDown}
      label={order === "asc" ? "Ascending order" : "Descending order"}
      className="group hover:bg-accent flex items-center overflow-auto rounded-xl transition-all duration-700 hover:ml-2"
      variant="ghost"
      onClick={toggleSortOrder}
    />
  );
}

export function FolderListPageMenuBar({ sort, updateSort, order, toggleSortOrder }: FolderListPageMenuBarProps) {
  return (
    <>
      <div className="bg-card/30 sticky top-20 z-10 flex justify-between rounded-2xl border p-1 shadow-sm backdrop-blur-md">
        <div className="flex">
          <FolderSortDropdownMenu sort={sort} updateSort={updateSort} />
          <OrderButton order={order} toggleSortOrder={toggleSortOrder} />
        </div>
        <div className="flex">
          <CreateFolderCard />
          <ExpandableButton Icon={Share} label="Share" variant="ghost" />
          <ExpandableButton
            Icon={Trash}
            variant="ghost"
            className="hover:bg-red-200 hover:text-red-500 dark:hover:bg-red-900/40"
            label="Delete folder"
          />
          <ExpandableButton Icon={EllipsisVertical} label="More" variant="ghost" />
        </div>
      </div>
    </>
  );
}
