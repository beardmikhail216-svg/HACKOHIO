import { useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // TODO:
    // Register API call
    // Login API call
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          ProjectHub
        </h1>

        <p className="text-slate-400 text-center mb-8">
          {isLogin
            ? "Sign in to your account"
            : "Create your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-blue-400 hover:text-blue-300"
        >
          {isLogin
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default App;