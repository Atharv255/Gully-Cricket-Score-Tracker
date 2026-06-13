import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import ViewerRoutes from "./ViewerRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<ViewerRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;