import { useEffect } from "react";

const folderEvents = new EventTarget();

export function useFolderListRefresh(callback: () => void) {
  useEffect(() => {
    const handleRefresh = () => callback();
    folderEvents.addEventListener('refresh', handleRefresh);
    return () => folderEvents.removeEventListener('refresh', handleRefresh);
  }, [callback]);
}

export function triggerFolderListRefresh() {
  folderEvents.dispatchEvent(new Event('refresh'));
}