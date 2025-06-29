import { useState } from "react";
import { useFolderService } from "@/services/useFolderService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { folderCreateSchema, FolderCreateTypes, folderNameMaxLength } from "@/types/folder.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { triggerFolderListRefresh } from "../hooks/useFolderListRefresh";
import { Input } from "@/components/ui/input";

export default function FolderUpdateInfoDialog({
  slug,
  name,
  description,
  tags,
  isPublic,
}: {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  isPublic: boolean;
}) {
  const { changeFolderInfo } = useFolderService();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const folderUpdateForm = useForm<FolderCreateTypes>({
    resolver: zodResolver(folderCreateSchema),
    defaultValues: {
      name: name,
      description: description || "",
      tags: tags || [],
      isPublic: isPublic || false,
    },
  });

  const onSubmit = async (folderData: FolderCreateTypes) => {
    setLoading(true);
    try {
      await changeFolderInfo(slug, folderData);
      toast.success("Folder updated successfully!");
      setOpen(false);
      // setTimeout here is very important
      // it allows the dialog to close before refreshing the folder list
      setTimeout(() => {
        triggerFolderListRefresh();
      }, 1000);
    } catch (error) {
      toast.error("Failed to update folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
          <PencilLine />
          Update Info
        </Button>
      </DialogTrigger>
      <DialogContent className="text-card-foreground border-transparent shadow-lg">
        <DialogTitle>Update folder information</DialogTitle>
        <DialogDescription>Modify folder name, description, and settings</DialogDescription>
        <Form {...folderUpdateForm}>
          <form onSubmit={folderUpdateForm.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={folderUpdateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Folder Name</FormLabel>
                      <div className="text-right text-xs text-neutral-500">
                        {folderUpdateForm.watch("name")?.length || 0}/{folderNameMaxLength}
                      </div>
                    </div>
                    <FormControl>
                      <Input type="text" placeholder="Enter folder name" {...field} className="bg-input w-full rounded-md border p-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={folderUpdateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder Description</FormLabel>
                    <FormControl>
                      <textarea placeholder="Enter folder description" {...field} className="bg-input min-h-[40px] w-full rounded-md border p-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={folderUpdateForm.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Make folder public</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Folder"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
