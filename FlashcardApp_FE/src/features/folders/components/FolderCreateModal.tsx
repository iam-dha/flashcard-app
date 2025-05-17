import { useState } from "react";
import { folderService } from "@/services/folderService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { folderCreateSchema, FolderCreateTypes, folderNameMaxLength } from "@/types/folder.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function CreateFolderCard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const folderCreateForm = useForm<FolderCreateTypes>({
    resolver: zodResolver(folderCreateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (folderData: FolderCreateTypes) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await folderService.createFolder(folderData);
      setSuccess("Folder created successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setError("Failed to create folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...folderCreateForm}>
      <Card className="space-y-4 py-6">
        <CardHeader className="w-md">
          <CardTitle className="text-2xl">Create new folder</CardTitle>
          <CardDescription>Enter folder name and description</CardDescription>
          {error && (
            <div className="bg-destructive/15 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 mt-6 flex items-center gap-2 rounded-md bg-green-200 p-3 text-sm text-green-500 dark:bg-green-700 dark:text-green-300">
              {success}
            </div>
          )}
        </CardHeader>

        <form onSubmit={folderCreateForm.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={folderCreateForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                  <FormLabel>Folder Name</FormLabel>
                  <div className="text-xs text-neutral-500 text-right">
                    {folderCreateForm.watch("name")?.length || 0}/{folderNameMaxLength}
                  </div>
                  </div>
                  <FormControl>
                    <input type="text" placeholder="Enter folder name" {...field} className="w-full rounded-md border p-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={folderCreateForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Description</FormLabel>
                  <FormControl>
                    <textarea placeholder="Enter folder description" {...field} className="w-full rounded-md border p-2 min-h-[40px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={folderCreateForm.control}
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
              {loading ? "Creating..." : "Create Folder"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </Form>
  );
}
