import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import AmbientBackground from "./components/AmbientBackground";
import Nav from "./components/Nav";
import RoboGuide from "./components/RoboGuide";
import PageTransition from "./components/motion/PageTransition";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import QuestionsPage from "./pages/QuestionsPage";
import AgentSelectionPage from "./pages/AgentSelectionPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import AgentSettingsPage from "./pages/AgentSettingsPage";
import ProfilePage from "./pages/ProfilePage";

// Single source of truth mapping the app's logical "environments" to real URLs.
const KEY_TO_PATH = {
  landing: "/",
  auth: "/auth",
  questions: "/idea",
  select: "/idea/select",
  results: "/results",
  dashboard: "/results",
  history: "/history",
  settings: "/settings",
  profile: "/profile",
};
const PATH_TO_KEY = Object.fromEntries(
  Object.entries(KEY_TO_PATH).map(([k, v]) => [v, k])
);

// Protected routes requiring authentication
function RequireAuth({ user, children }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  return children;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [customAgents, setCustomAgents] = useState(() => {
    const saved = localStorage.getItem("custom_agents");
    return saved ? JSON.parse(saved) : {};
  });

  const go = (key) => navigate(KEY_TO_PATH[key] || "/");
  const currentKey = PATH_TO_KEY[location.pathname] || "landing";

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("custom_agents", JSON.stringify(customAgents));
  }, [customAgents]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const isWorkspacePage = ["results", "dashboard", "settings", "profile", "history"].includes(currentKey);

  return (
    <div className="min-h-screen text-text transition-colors duration-500">
      <AmbientBackground />
      {!isWorkspacePage && <Nav go={go} current={currentKey} user={user} setUser={setUser} />}
      <main className="relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <LandingPage go={go} />
                </PageTransition>
              }
            />
            <Route
              path="/auth"
              element={
                <PageTransition>
                  <AuthPage go={go} setUser={setUser} />
                </PageTransition>
              }
            />
            <Route
              path="/idea"
              element={
                <RequireAuth user={user}>
                  <PageTransition>
                    <QuestionsPage go={go} user={user} setUser={setUser} />
                  </PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/idea/select"
              element={
                <RequireAuth user={user}>
                  <PageTransition>
                    <AgentSelectionPage go={go} user={user} />
                  </PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/results"
              element={
                <RequireAuth user={user}>
                  <PageTransition>
                    <DashboardPage go={go} user={user} setUser={setUser} customAgents={customAgents} setCustomAgents={setCustomAgents} />
                  </PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth user={user}>
                  <PageTransition>
                    <DashboardPage go={go} user={user} setUser={setUser} customAgents={customAgents} setCustomAgents={setCustomAgents} />
                  </PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/history"
              element={
                <RequireAuth user={user}>
                  <PageTransition>
                    <HistoryPage go={go} user={user} />
                  </PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth user={user}>
                  <PageTransition>
                    <AgentSettingsPage go={go} user={user} setUser={setUser} customAgents={customAgents} setCustomAgents={setCustomAgents} />
                  </PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth user={user}>
                  <PageTransition>
                    <ProfilePage go={go} user={user} setUser={setUser} />
                  </PageTransition>
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Floating 3D AI Robo Companion Assistant */}
      <RoboGuide go={go} current={currentKey} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
