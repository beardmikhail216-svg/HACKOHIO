import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

import {
  getCurrentUser,
  logout,
} from "./services/authService";

function AppContent() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogout = async () => {
    setLogoutError("");

    try {
      await logout();
      setUser(null);
    } catch (error) {
      setLogoutError(
        error.response?.data?.message || "Logout failed."
      );
    }
  };

  if (checkingSession) {
    return (
      <div className="p-8 text-center">
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between gap-4 border-b bg-white p-4">
        <Link to="/" className="text-xl font-bold text-blue-700">
          ProjectHub
        </Link>
        <div className="flex items-center gap-4">
          {logoutError && (
            <p role="alert" className="text-sm text-red-600">
              {logoutError}
            </p>
          )}

          <span className="hidden text-sm text-gray-600 sm:inline">
            {user.userName}
          </span>

          <button
            onClick={handleLogout}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={<DashboardPage user={user} />}
        />

        <Route
          path="/projects/:projectId"
          element={<ProjectDetailPage user={user} />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
