import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
