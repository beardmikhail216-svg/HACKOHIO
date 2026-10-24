
import { useEffect, useState } from "react";
import MultiSelect from "./Dropdown";
import { projectOptions } from "../constants/projectOptions";

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  title: "",
  description: "",
  languages: [],
  frameworks: [],
  databases: [],
  topics: [],
  date: today,
  registrationMode: "approval",
};

function toFormValues(project) {
  if (!project) {
    return {
      ...emptyForm,
      languages: [],
      frameworks: [],
      databases: [],
      topics: [],
    };
  }

  return {
    title: project.title ?? "",
    description: project.description ?? "",
    languages: project.languages ?? [],
    frameworks: project.frameworks ?? [],
    databases: project.databases ?? [],
    topics: project.topics ?? [],
    date: project.date
      ? new Date(project.date).toISOString().slice(0, 10)
      : today,
    registrationMode: project.registrationMode ?? "approval",
  };
}

function ProjectForm({ project, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(project));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(toFormValues(project));
    setError("");
  }, [project]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const projectData = {
      title: form.title.trim(),
      description: form.description.trim(),
      languages: form.languages,
      frameworks: form.frameworks,
      databases: form.databases,
      topics: form.topics,
      date: form.date,
      registrationMode: form.registrationMode,
    };

    setSaving(true);

    try {
      await onSubmit(projectData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save the project."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900";

  const multiSelectFields = [
    ["languages", "Languages", projectOptions.languages],
    ["frameworks", "Frameworks", projectOptions.frameworks],
    ["databases", "Databases", projectOptions.databases],
    ["topics", "Topics / interests", projectOptions.topics],
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {project ? "Edit project" : "Create a project"}
      </h2>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block font-medium">
          Project title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
          required
          maxLength={120}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block font-medium"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className={inputClass}
          rows={4}
          required
        />
      </div>

      {multiSelectFields.map(([name, label, options]) => (
        <div key={name}>
          <label className="mb-1 block font-medium">
            {label}
          </label>

          <MultiSelect
            label={label}
            options={options}
            value={form[name]}
            onChange={(selected) =>
              setForm((previous) => ({
                ...previous,
                [name]: selected,
              }))
            }
          />
        </div>
      ))}

      <div>
        <label htmlFor="date" className="mb-1 block font-medium">
          Project date
        </label>
        <input
          id="date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label
          htmlFor="registrationMode"
          className="mb-1 block font-medium"
        >
          Registration mode
        </label>

        <select
          id="registrationMode"
          name="registrationMode"
          value={form.registrationMode}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="approval">Requires approval</option>
          <option value="open">Open registration</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : project
              ? "Save changes"
              : "Create project"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProjectForm;
