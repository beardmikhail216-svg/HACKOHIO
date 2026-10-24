
import { useCallback, useEffect, useState } from "react";
import ProjectForm from "../components/ProjectForm";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

function DashboardPage({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const { data } = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "Could not load projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const userId = user?._id ?? user?.id;

  const isOwner = (project) => {
    const developerId =
      typeof project.developer === "object"
        ? project.developer?._id
        : project.developer;

    return developerId && userId &&
      String(developerId) === String(userId);
  };

  const handleCreate = async (projectData) => {
    setSaving(true);

    try {
      await createProject(projectData);
      setShowForm(false);
      await loadProjects();
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (projectData) => {
    if (!editingProject) return;

    setSaving(true);

    try {
      await updateProject(editingProject._id, projectData);
      setEditingProject(null);
      await loadProjects();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setPageError("");

    try {
      await deleteProject(project._id);
      setProjects((current) =>
        current.filter((item) => item._id !== project._id)
      );
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "Could not delete this project."
      );
    }
  };

  if (loading) {
    return <p className="p-6">Loading projects...</p>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">ProjectHub</h1>
          <p className="mt-1 text-gray-600">
            Welcome, {user?.userName}.
          </p>
        </div>

        {!showForm && !editingProject && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
          >
            + Create project
          </button>
        )}
      </header>

      {pageError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
          {pageError}
        </p>
      )}

      {showForm && (
        <section className="rounded-xl border p-5">
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
          {saving && <p className="mt-2 text-sm">Saving project...</p>}
        </section>
      )}

      {editingProject && (
        <section className="rounded-xl border p-5">
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProject(null)}
          />
          {saving && <p className="mt-2 text-sm">Saving changes...</p>}
        </section>
      )}

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          Available projects
        </h2>

        {projects.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-gray-600">
            No projects yet. Create the first one!
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project._id}
                className="flex flex-col rounded-xl border p-5 shadow-sm"
              >
                <h3 className="text-xl font-semibold">
                  {project.title}
                </h3>

                <p className="mt-2 flex-1 whitespace-pre-wrap text-gray-600">
                  {Array.isArray(project.description)
                    ? project.description.join("\n")
                    : project.description}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  {project.languages?.length > 0 && (
                    <p>
                      <strong>Languages:</strong>{" "}
                      {project.languages.join(", ")}
                    </p>
                  )}

                  {project.frameworks?.length > 0 && (
                    <p>
                      <strong>Frameworks:</strong>{" "}
                      {project.frameworks.join(", ")}
                    </p>
                  )}

                  {project.databases?.length > 0 && (
                    <p>
                      <strong>Databases:</strong>{" "}
                      {project.databases.join(", ")}
                    </p>
                  )}

                  {project.topics?.length > 0 && (
                    <p>
                      <strong>Topics:</strong>{" "}
                      {project.topics.join(", ")}
                    </p>
                  )}

                  <p>
                    <strong>Registration:</strong>{" "}
                    {project.registrationMode === "open"
                      ? "Open"
                      : "Requires approval"}
                  </p>
                </div>

                {isOwner(project) && (
                  <div className="mt-5 flex gap-3 border-t pt-4">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingProject(project);
                      }}
                      className="rounded-lg border px-3 py-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(project)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;