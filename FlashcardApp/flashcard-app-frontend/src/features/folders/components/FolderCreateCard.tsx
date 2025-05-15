import React, { useState } from "react";
import { folderService } from "@/services/folderService";
import { FolderTypes } from "@/types/folder.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleCheck } from "lucide-react";

export default function CreateFolderCard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const folderData: FolderTypes = {
      name,
      description,
    } as FolderTypes;

    try {
      await folderService.createFolder(folderData);
      setSuccess("Folder created successfully!");
      setName("");
      setDescription("");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError("Failed to create folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card w-xl space-y-4 rounded-lg p-8 shadow-md">
      <p className="text-xl font-bold">Create New Folder</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Folder Name:
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description:
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Folder"}
        </Button>
        {error && (
          <div className="bg-destructive/15 text-destructive mt-4 flex items-center gap-2 rounded-md p-3 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-green-200 p-3 text-sm text-green-500 dark:bg-green-700 dark:text-green-300">
            <CircleCheck className="h-4 w-4" />
            {success}
          </div>
        )}
      </form>
    </div>
  );
}
