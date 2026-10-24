
import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import {
  getCurrentUser,
  logout,
} from "./services/authService";

function App() {
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
    <div>
      <div className="flex items-center justify-end gap-4 border-b p-4">
        {logoutError && (
          <p role="alert" className="text-sm text-red-600">
            {logoutError}
          </p>
        )}

        <button
          onClick={handleLogout}
          className="rounded-lg border px-4 py-2"
        >
          Log out
        </button>
      </div>

      <DashboardPage user={user} />
    </div>
  );
}

export default App;
