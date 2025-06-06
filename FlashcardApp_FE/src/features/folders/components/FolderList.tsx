import { FolderTypes } from "@/types/folder.types";
import FolderCard from "./FolderCard";
import { useGetFolderList } from "../hooks/useGetFolderList";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DeleteFolderCard from "./FolderDeleteDialog";

export function FolderListGridView({ folderList }: { folderList: FolderTypes[] }) {
  const { folderListLoading } = useGetFolderList();
  if (folderListLoading) {
    return <CustomLoader />;
  } else {
    return (
      <div className="mt-6 h-auto w-full">
        <div className="grid w-full min-w-xs grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {folderList.map((folder: FolderTypes) => (
            <FolderCard key={folder.slug} folder={folder} />
          ))}
        </div>
      </div>
    );
  }
}

export function FolderListTableView({ folderList }: { folderList: FolderTypes[] }) {
  const { folderListLoading } = useGetFolderList();
  if (folderListLoading) {
    return <CustomLoader />;
  } else {
    return (
      <Table className="bg-card/30 rounded-2xl shadow-sm backdrop-blur-md">
        <TableHeader className="bg-card/70 rounded-t-2xl">
          <TableRow className="px-4">
            <TableHead className="font-bold border-r">Folder Name</TableHead>
            <TableHead className="font-bold border-r">Created At</TableHead>
            <TableHead className="font-bold border-r">Flashcards Count</TableHead>
            <TableHead className="font-bold" colSpan={2}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folderList.map((folder: FolderTypes) => (
            <TableRow key={folder.slug}>
              <TableCell className="border-r">
                <Button variant="link">{folder.name}</Button>
              </TableCell>
              <TableCell className="border-r">{new Date(folder.createdAt).toLocaleDateString("en-GB")}</TableCell>
              <TableCell className="border-r">{folder.flashcardCount}</TableCell>
              <TableCell className="border-r">
                <Button
                  className="hover:bg-accent/80 bg-accent text-accent-foreground justify-start rounded-2xl shadow-sm"
                  onClick={() => (window.location.href = `/folders/${folder?.slug}/study`)}
                >
                  Study
                </Button>
                <DeleteFolderCard slug={folder.slug} name={folder.name} />
              </TableCell>
              <TableCell className=""></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
