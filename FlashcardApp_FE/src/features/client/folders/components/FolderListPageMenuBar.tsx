import { ArrowUp, ArrowDown } from "lucide-react"; // Import the form
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import FolderCreateDialog from "./FolderCreateDialog";
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
      className="group hover:bg-card/50 flex items-center overflow-auto rounded-xl transition-all duration-300 hover:ml-2"
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
          <FolderCreateDialog />
        </div>
      </div>
    </>
  );
}
