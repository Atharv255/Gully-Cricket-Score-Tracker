import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewerLayout from "../layouts/ViewerLayout";
import HomePage from "../pages/viewer/HomePage";
import LiveMatchPage from "../pages/viewer/LiveMatchPage";
import MatchDetailPage from "../pages/viewer/MatchDetailPage";
import ScorecardPage from "../pages/viewer/ScorecardPage";
import NotFoundPage from "../pages/auth/NotFoundPage";

const ViewerRoutes = () => {
  return (
    <Routes>
      <Route element={<ViewerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="live/:matchId" element={<LiveMatchPage />} />
        <Route path="match/:matchId" element={<MatchDetailPage />} />
        <Route path="scorecard/:matchId" element={<ScorecardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default ViewerRoutes;