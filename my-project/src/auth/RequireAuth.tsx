import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({
  allowedRoles,
  children,
}: {
  allowedRoles: ("mentor" | "student" | "admin")[];
  children: React.JSX.Element;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role as "mentor" | "student" | "admin")) {
    return <Navigate to="/login" replace />;
  }

  return children;
}