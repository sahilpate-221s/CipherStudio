import React from "react";
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./components/home/LandingPage";
import ProfilePage from "./components/home/ProfilePage";
import ProjectsPage from "./components/home/ProjectsPage";
import Studio from "./components/Studio";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
           </ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        } />

        <Route path="/studio/:projectSlug" element={
          <ProtectedRoute>
            <Studio />
          </ProtectedRoute>
        } />

      </Routes>
    </ThemeProvider>
  );
}
