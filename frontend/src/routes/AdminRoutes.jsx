import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import CreateMatchPage from "../pages/admin/CreateMatchPage";
import ManageMatchPage from "../pages/admin/ManageMatchPage";
import LiveScoringPage from "../pages/admin/LiveScoringPage";
import MatchHistoryPage from "../pages/admin/MatchHistoryPage";
import TeamManagementPage from "../pages/admin/TeamManagementPage";
import PlayerManagementPage from "../pages/admin/PlayerManagementPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="create-match" element={<CreateMatchPage />} />
        <Route path="match/:matchId/manage" element={<ManageMatchPage />} />
        <Route path="match/:matchId/scoring" element={<LiveScoringPage />} />
        <Route path="history" element={<MatchHistoryPage />} />
        <Route path="teams" element={<TeamManagementPage />} />
        <Route path="players" element={<PlayerManagementPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;