
import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import {
  getCurrentUser,
  logout,
} from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ProjectHub</h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
        >
          Log out
        </button>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">
          Welcome, {user.userName}!
        </h2>

        <p className="mt-2 text-slate-400">
          Your ProjectHub dashboard will go here.
        </p>
      </section>
    </main>
  );
}

export default App;
