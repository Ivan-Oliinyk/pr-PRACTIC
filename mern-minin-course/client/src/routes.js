import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import LinksPage from "./pages/LinksPage";
import CreatePage from "./pages/CreatePage";
import DetailPage from "./pages/DetailPage";
import AuthPage from "./pages/AuthPage";

export const userRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/links" exact element={<LinksPage />} />
        <Route path="/create" exact element={<CreatePage />} />
        <Route path="/detail:id" exact element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/create" />} />
        {/* <Redirect to="/create" element={<CreatePage />} /> */}
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" exact element={<AuthPage />} />
      <Route path="*" element={<AuthPage />} />
    </Routes>
  );
};
