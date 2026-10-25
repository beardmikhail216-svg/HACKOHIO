
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "../services/authService";
import { projectOptions } from "../constants/projectOptions";

const OPTIONS = {
  languages: projectOptions.languages,
  frameworks: projectOptions.frameworks,
  databases: projectOptions.databases,
  interests: projectOptions.topics,
};

const AVATARS = {
  user: "👤",
  code: "💻",
  rocket: "🚀",
  gamepad: "🎮",
  brain: "🧠",
  palette: "🎨",
};

const COLORS = {
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
  gray: "bg-gray-200 text-gray-700",
};

function ProfilePage({ user, onUserUpdated }) {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    languages: [],
    frameworks: [],
    databases: [],
    interests: [],
    avatarIcon: "user",
    avatarColor: "blue",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setForm({
      userName: user?.userName || "",
      email: user?.email || "",
      languages: user?.languages || [],
      frameworks: user?.frameworks || [],
      databases: user?.databases || [],
      interests: user?.interests || [],
      avatarIcon: user?.avatarIcon || "user",
      avatarColor: user?.avatarColor || "blue",
    });
  }, [user]);

  const toggleOption = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setForm({
      userName: user?.userName || "",
      email: user?.email || "",
      languages: user?.languages || [],
      frameworks: user?.frameworks || [],
      databases: user?.databases || [],
      interests: user?.interests || [],
      avatarIcon: user?.avatarIcon || "user",
      avatarColor: user?.avatarColor || "blue",
    });
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const { data } = await updateProfile(form);

      onUserUpdated(data.user);
      setNotice("Your profile has been updated.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <Link to="/" className="text-sm font-medium text-blue-700 hover:underline">
        ← Back to ProjectHub
      </Link>

      <section className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
              COLORS[form.avatarColor] || COLORS.blue
            }`}
            aria-label="Avatar preview"
          >
            {AVATARS[form.avatarIcon] || AVATARS.user}
          </div>

          <div>
            <h1 className="text-2xl font-bold">Account settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your information and developer interests.
            </p>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}

        {notice && (
          <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-green-800">
            {notice}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Basic information</h2>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Username</span>
              <input
                name="userName"
                value={form.userName}
                onChange={handleChange}
                required
                maxLength={50}
                autoComplete="username"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
              />
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Choose an avatar</h2>

            <div className="flex flex-wrap gap-3">
              {Object.entries(AVATARS).map(([key, symbol]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, avatarIcon: key }))
                  }
                  aria-pressed={form.avatarIcon === key}
                  aria-label={`Choose ${key} avatar`}
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border text-2xl ${
                    form.avatarIcon === key
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-200"
                  }`}
                >
                  {symbol}
                </button>
              ))}
            </div>

            <p className="text-sm font-medium">Avatar color</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(COLORS).map(([key, colorClass]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, avatarColor: key }))
                  }
                  aria-pressed={form.avatarColor === key}
                  className={`rounded-lg px-4 py-2 text-sm capitalize ${colorClass} ${
                    form.avatarColor === key
                      ? "ring-2 ring-gray-800 ring-offset-2"
                      : ""
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </section>

          {Object.entries(OPTIONS).map(([field, options]) => (
            <section key={field} className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold capitalize">
                  {field === "interests" ? "Interests" : field}
                </h2>
                <p className="text-sm text-gray-500">
                  Select all that apply.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={form[field].includes(option)}
                      onChange={() => toggleOption(field, option)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}

          <div className="flex flex-wrap gap-3 border-t pt-5">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border px-5 py-2.5 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Reset changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ProfilePage;
