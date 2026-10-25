
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProfilePage from "./pages/ProfilePage";

import {
  getCurrentUser,
  logout,
} from "./services/authService";

const AVATARS = {
  user: "👤",
  code: "💻",
  rocket: "🚀",
  gamepad: "🎮",
  brain: "🧠",
  palette: "🎨",
};

const AVATAR_COLORS = {
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
  gray: "bg-gray-200 text-gray-700",
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [logoutError, setLogoutError] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

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
      setAccountMenuOpen(false);
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

  const avatarIcon = AVATARS[user.avatarIcon] || AVATARS.user;
  const avatarColor =
    AVATAR_COLORS[user.avatarColor] || AVATAR_COLORS.blue;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between gap-4 border-b bg-white px-4 py-3 sm:px-6">
        <Link to="/" className="text-xl font-bold text-blue-700">
          ProjectHub
        </Link>

        <div className="relative flex items-center gap-3">
          {logoutError && (
            <p role="alert" className="max-w-48 text-sm text-red-600">
              {logoutError}
            </p>
          )}

          <button
            type="button"
            onClick={() => setAccountMenuOpen((open) => !open)}
            aria-label="Open account menu"
            aria-expanded={accountMenuOpen}
            className="flex items-center gap-2 rounded-full border border-gray-200 p-1.5 pr-3 hover:bg-gray-50"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xl ${avatarColor}`}
            >
              {avatarIcon}
            </span>

            <span className="hidden max-w-36 truncate text-sm font-medium sm:inline">
              {user.userName}
            </span>

            <span aria-hidden="true" className="text-xs text-gray-500">
              ▼
            </span>
          </button>

          {accountMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setAccountMenuOpen(false)}
              />

              <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border bg-white p-2 shadow-lg">
                <div className="border-b px-3 py-3">
                  <p className="truncate font-semibold">
                    {user.userName}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setAccountMenuOpen(false)}
                  className="mt-2 block rounded-lg px-3 py-2.5 text-sm hover:bg-gray-100"
                >
                  <span aria-hidden="true">⚙️ </span>
                  My profile & settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-700 hover:bg-red-50"
                >
                  <span aria-hidden="true">↪ </span>
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </header>

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
          path="/profile"
          element={
            <ProfilePage
              user={user}
              onUserUpdated={setUser}
            />
          }
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
