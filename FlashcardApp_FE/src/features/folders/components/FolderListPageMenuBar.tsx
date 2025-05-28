import { EllipsisVertical, Share, Trash, ArrowUp, ArrowDown } from "lucide-react"; // Import the form
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import CreateFolderCard from "./FolderCreateDialog";
import FolderSortDropdownMenu from "./FolderSortDropdownMenu";

interface FolderListPageMenuBarProps {
  sort: "createdAt" | "name" | "updatedAt" | "isPublic";
  setSort: React.Dispatch<React.SetStateAction<"createdAt" | "name" | "updatedAt" | "isPublic">>;
  order: "asc" | "desc";
  setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
}

function OrderButton({ order, setOrder }: Pick<FolderListPageMenuBarProps, "order" | "setOrder">) {
  return (
    <ExpandableButton
      Icon={order === "asc" ? ArrowUp : ArrowDown}
      label={order === "asc" ? "Ascending order" : "Descending order"}
      className="group hover:bg-accent/50 flex items-center overflow-auto rounded-xl transition-all duration-700"
      variant="ghost"
      onClick={() => setOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
    />
  );
}

export function FolderListPageMenuBar({ sort, setSort, order, setOrder }: FolderListPageMenuBarProps) {
  return (
    <>
      <div className="frosted-glass sticky top-20 z-10 mb-4 flex h-max justify-between rounded-xl border p-1 md:mb-6">
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
        <div className="flex">
          <FolderSortDropdownMenu sort={sort} setSort={setSort} />
          <OrderButton order={order} setOrder={setOrder} />
        </div>
      </div>
    </>
  );
}
