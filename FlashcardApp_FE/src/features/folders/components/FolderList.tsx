import { FolderTypes } from "@/types/folder.types";
import FolderCard from "./FolderCard";
import { useGetFolderList } from "../hooks/useGetFolderList";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DeleteFolderCard from "./FolderDeleteDialog";
import { GraduationCap, Trash } from "lucide-react";

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
      <Table className="rounded-2xl shadow-lg backdrop-blur-md">
        <TableHeader className="bg-card/80 rounded-t-2xl">
          <TableRow>
            <TableHead className="px-4 font-bold">Folder Name</TableHead>
            <TableHead className="px-4 font-bold">Created At</TableHead>
            <TableHead className="px-4 font-bold">Flashcards Count</TableHead>
            <TableHead className="px-4 font-bold">Public Status</TableHead>
            <TableHead className="px-4 font-bold text-right" colSpan={2}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-card/30">
          {folderList.map((folder: FolderTypes) => (
            <TableRow key={folder.slug} className="group hover:bg-card/60 border-none transition-colors duration-200">
              <TableCell className="border-border/10 border-r px-4 flex flex-1">
                <Button
                  variant="link"
                  className="h-auto p-0 font-medium transition-colors"
                  onClick={() => (window.location.href = `/folders/${folder?.slug}`)}
                >
                  {folder.name}
                </Button>
              </TableCell>
              <TableCell className="border-border/10 border-r px-4">{new Date(folder.createdAt).toLocaleDateString("en-GB")}</TableCell>
              <TableCell className="border-border/10 border-r px-4">
                <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {folder.flashcardCount < 2 ? `${folder.flashcardCount} flashcard` : `${folder.flashcardCount} flashcards`}
                </span>
              </TableCell>
              <TableCell className="border-border/10 border-r px-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${folder.isPublic ? 'bg-green-200 text-green-800' : 'bg-blue-300 text-blue-800'}`}>
                  {folder.isPublic ? 'Public' : 'Private'}
                </span>
              </TableCell>
              <TableCell className="px-4 flex justify-end">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/60 text-primary transform rounded-lg border-0 opacity-0 transition-all duration-200 group-hover:scale-105 group-hover:opacity-100"
                    onClick={() => (window.location.href = `/folders/${folder?.slug}/study`)}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Study
                  </Button>
                  <DeleteFolderCard
                    slug={folder.slug}
                    name={folder.name}
                    trigger={
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive transform rounded-lg opacity-0 transition-all duration-200 group-hover:scale-105 group-hover:opacity-100"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
