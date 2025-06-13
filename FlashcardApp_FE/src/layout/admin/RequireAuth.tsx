// src/auth/RequireAuth.tsx
import React from "react";
import { useAdminAuth } from "./AdminAuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useAdminAuth();
  const location = useLocation();

  // Nếu chưa có token thì redirect đến /login
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
