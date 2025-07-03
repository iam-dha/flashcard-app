import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layout/client/AppLayout";
import AuthLayout from "@/layout/client/AuthLayout";
import LoginPage from "@/features/client/auth/LoginPage";
import { Home, Search, Folder, Gamepad2 } from "lucide-react";
import { ReactNode } from "react";
import HomePage from "@/features/client/home/HomePage";
import PostDetailPage from "@/features/client/post/PostDetailPage";
import SearchPage from "@/features/client/search/SearchPage";
import { FlashcardDeck } from "@/features/client/flashcards/FlashcardDeck";
import FoldersListPage from "@/features/client/folders/FolderListPage";
import FolderSharePage from "@/features/client/share-folder/FolderSharePage";
import FolderDetailPage from "@/features/client/folders/FolderDetailPage";
import RegisterPage from "@/features/client/auth/RegisterPage";
import ResetPasswordPage from "@/features/client/auth/ResetPasswordPage";
import GamesPage from "@/features/client/games/GamesPage";
import UserLayout from "@/layout/client/UserLayout";
import UserProfilePage from "@/features/client/user/UserProfilePage";

import AdminLayout from "@/layout/admin/AdminLayout";
import AdminLoginPage from "@/layout/admin/AdminLoginPage";
import AdminDashboardLayout from "@/layout/admin/AdminDashboardLayout";
import AdminProfilePage from "@/layout/admin/AdminProfilePage";
import UserManagementTable from "@/features/admin/user/UserManagement";
import PostManagementTable from "@/features/admin/post/PostManagement";
import RoleManagement from "@/features/admin/role/RoleManagement";
import { RequireAuth } from "@/layout/admin/RequireAuth";

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
    path: "/posts/:slug",
    title: "Posts",
    element: <PostDetailPage />,
  },
  {
    path: "/search/",
    title: "Search",
    icon: <Search />,
    element: <SearchPage />,
    showInSidebar: true,
  },
  {
    path: "/search/:word",
    title: "Search",
    icon: <Search />,
    element: <SearchPage />,
    showInSidebar: false,
  },
  {
    path: "/folders",
    title: "Folders",
    icon: <Folder />,
    element: <FoldersListPage />,
    showInSidebar: true,
  },
  {
    path: "/folders/:slug",
    title: "Folder",
    icon: <Folder />,
    element: <FolderDetailPage />,
  },
  {
    path: "/folders/:slug/study",
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
    path: "/share-folder/:slug",
    element: <FolderSharePage />,
    title: "Share Folder",
    showInSidebar: false,
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
    const slug = pathParts[2];
    const folderRoute = routes.find((route) => route.path === "/folders/:slug");

    if (folderRoute) {
      // return a FolderRouteConfig
      return {
        ...folderRoute,
        type: "folder",
        slug,
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
  slug: string;
  folderParams?: {
    page?: number;
    limit?: number;
    sort?: "createdAt" | "name" | "updatedAt" | "isPublic";
    order?: "asc" | "desc";
  };
}

// user-specific route configuration
export interface UserRouteConfig extends BaseRouteConfig {
  type: "user";
  userId: string;
}

export const getPaginationParams = (searchParams: URLSearchParams, route?: FolderRouteConfig) => {
  const page = parseInt(searchParams.get("page") || route?.folderParams?.page?.toString() || "1");
  const limit = parseInt(searchParams.get("limit") || route?.folderParams?.limit?.toString() || "12");
  const sort = searchParams.get("sort") || route?.folderParams?.sort || "createdAt";
  const order = (searchParams.get("order") as "asc" | "desc") || route?.folderParams?.order || "desc";

  return { page, limit, sort, order };
};

// Utility function to build URL with pagination parameters
export const buildPaginationUrl = (basePath: string, params: { page?: number; limit?: number; sort?: string; order?: "asc" | "desc" }) => {
  const searchParams = new URLSearchParams();

  if (params.page && params.page > 1) searchParams.set("page", params.page.toString());
  if (params.limit && params.limit !== 12) searchParams.set("limit", params.limit.toString());
  if (params.sort && params.sort !== "createdAt") searchParams.set("sort", params.sort);
  if (params.order && params.order !== "desc") searchParams.set("order", params.order);

  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

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
      {
        path: "/auth/register",
        element: <RegisterPage />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
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
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "/user/profile",
        element: <UserProfilePage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "login",
        element: <AdminLoginPage />,
      },
      {
        path: "",
        element: (
          <RequireAuth>
            <AdminDashboardLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <AdminProfilePage />,
          },
          {
            path: "user",
            element: <UserManagementTable />,
          },
          {
            path: "post",
            element: <PostManagementTable />,
          },
          {
            path: "access",
            element: <RoleManagement />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/admin/login" replace />,
      },
    ],
  },
]);
