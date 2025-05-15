import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import AuthLayout from "@/layout/AuthLayout";
import LoginPage from "@/features/auth/LoginPage";
import { Home, Search, PanelTop, Folder, Gamepad2, Cog } from "lucide-react";
import { ReactNode } from "react";
import HomePage from "@/features/home/HomePage";
import SearchPage from "@/features/search/SearchPage";
import FlashcardDeck from "@/features/flashcards/FlashcardDeck";
import FoldersPage from "@/features/folders/FoldersPage";
import SettingsPage from "@/features/settings/SettingsPage";
import GamesPage from "@/features/games/GamesPage";
import FolderDetailPage from "@/features/folders/FolderDetailPage";

// discriminated union type for all possible route configurations
type RouteConfig = BaseRouteConfig | FolderRouteConfig | UserRouteConfig;

export const routes: BaseRouteConfig[] = [
  {
    path: "/home",
    title: "Home",
    icon: <Home />,
    element: <HomePage />,
    showInSidebar: true,
  },
  {
    path: "/search",
    title: "Search",
    icon: <Search />,
    element: <SearchPage />,
    showInSidebar: true,
  },
  {
    path: "/flashcards",
    title: "Flashcards",
    icon: <PanelTop />,
    element: <FlashcardDeck />,
    showInSidebar: true,
  },
  {
    path: "/folders",
    title: "Folders",
    icon: <Folder />,
    element: <FoldersPage />,
    showInSidebar: true,
  },
  {
    path: "/folders/:folderId",
    title: "Folder",
    icon: <Folder />,
    element: <FolderDetailPage />,
  },
  {
    path: "/folders/:folderId/study",
    element: <FlashcardDeck />,
  },
  {
    path: "/games",
    title: "Games",
    icon: <Gamepad2 />,
    element: <GamesPage />,
    showInSidebar: true,
  },
  {
    path: "/settings",
    title: "Settings",
    icon: <Cog />,
    element: <SettingsPage />,
    showInSidebar: true,
  },
];

export const getRouteByPath = (path: string): RouteConfig | undefined => {
  // try to find an exact match
  const exactMatch = routes.find((route) => route.path === path);
  if (exactMatch) return exactMatch;

  // if no exact match, check for dynamic routes
  const pathParts = path.split("/");

  // handle folder detail pages
  if (pathParts.length === 3 && pathParts[1] === "folders") {
    const folderId = pathParts[2];
    const folderRoute = routes.find((route) => route.path === "/folders/:folderId");

    if (folderRoute) {
      // return a FolderRouteConfig
      return {
        ...folderRoute,
        type: "folder",
        folderId,
      };
    }
  }

  return undefined;
};

export interface BaseRouteConfig {
  path: string;
  title?: string;
  icon?: ReactNode;
  element: ReactNode;
  showInSidebar?: boolean;
}

// folder-specific route configuration
export interface FolderRouteConfig extends BaseRouteConfig {
  type: "folder";
  folderId: string;
}

// user-specific route configuration
export interface UserRouteConfig extends BaseRouteConfig {
  type: "user";
  userId: string;
}

// create child routes from the configuration
const childRoutes = routes.map((route) => ({
  path: route.path.replace(/^\//, ""), // remove leading slash
  element: route.element,
}));

// create the router with all routes
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      ...childRoutes,
      {
        path: "*",
        element: <div>404 Not Found</div>,
      },
    ],
  },
]);
