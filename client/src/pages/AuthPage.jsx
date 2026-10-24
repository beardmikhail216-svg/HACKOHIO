import { useState } from "react";
import { login, register } from "../services/authService";

const emptyForm = { userName: "", email: "", password: "" };

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 text-slate-50 " +
  "placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

// onAuthSuccess(user) is called after a successful login or registration.
// Use it to store the user in state/context and navigate to your home page.
export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleMode = () => {
    setMode(isRegister ? "login" : "register");
    setError("");
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // The register endpoint doesn't start a session, so log in right after.
        await register({
          userName: form.userName.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      }

      const { data } = await login({
        email: form.email.trim(),
        password: form.password,
      });

      onAuthSuccess?.(data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not reach the server. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-50">
      <section className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 px-5 py-8 text-center sm:px-10 sm:py-12">
        <h1 className="text-4xl font-bold">ProjectHub</h1>
        <p className="mb-8 mt-2 text-lg text-slate-400">
          {isRegister ? "Create your account" : "Sign in to your account"}
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              className={inputClass}
              type="text"
              name="userName"
              placeholder="Username"
              autoComplete="username"
              value={form.userName}
              onChange={handleChange}
              required
            />
          )}

          <input
            className={inputClass}
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className={inputClass}
            type="password"
            name="password"
            placeholder="Password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 8 : undefined}
            value={form.password}
            onChange={handleChange}
            required
          />

          {isRegister && (
            <p className="-mt-2 text-left text-sm text-slate-400">
              Use at least 8 characters.
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-left text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-700 py-4 text-base font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? isRegister
                ? "Creating account..."
                : "Signing in..."
              : isRegister
              ? "Create account"
              : "Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={toggleMode}
          className="mt-8 text-base text-blue-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {isRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
      </section>
    </main>
  );
}