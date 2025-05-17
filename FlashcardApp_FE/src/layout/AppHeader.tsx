import { useLocation } from "react-router-dom";
import { getRouteByPath } from "@/routes/router";
import { useIsMobile } from "@/hooks/useMobile";
import CustomSidebarTrigger from "../components/custom-ui/CustomSidebarTrigger";
import { useEffect, useState } from "react";
import { folderService } from "@/services/folderService";

export function usePageTitle() {
  const location = useLocation();
  const currentRoute = getRouteByPath(location.pathname);
  const [pageTitle, setPageTitle] = useState<string>("");

  useEffect(() => {
    if (!currentRoute) return;

    const getFolderName = async () => {
      if ("type" in currentRoute && currentRoute.type === "folder" && "slug" in currentRoute) {
        const folder = await folderService.getFolderBySlug(currentRoute.slug);
        setPageTitle(folder ? folder.name : "Folder");
      } else {
        setPageTitle(currentRoute.title || "");
      }
    };
    getFolderName();
  }, [currentRoute]);

  if (!currentRoute) {
    return null;
  }

  return pageTitle;
}

export default function AppHeader() {
  const pageTitle = usePageTitle();
  const isMobile = useIsMobile();

  return (
    <div className="frosted-glass sticky top-0 z-10 flex shrink-0 items-center border-b py-4">
      {isMobile && (
        <div className="-mr-2 ml-2">
          <CustomSidebarTrigger variant="open" />
        </div>
      )}
      <h1 className="ml-4 text-3xl font-semibold select-none md:ml-6">{pageTitle}</h1>
    </div>
  );
}
