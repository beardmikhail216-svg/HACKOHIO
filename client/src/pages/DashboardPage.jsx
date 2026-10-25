
import { useCallback, useEffect, useState } from "react";
import ProjectForm from "../components/ProjectForm";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

import {
  registerForProject,
  getMyRegistrations,
  getProjectRegistrations,
  deleteRegistration,
  approveRegistration,
  rejectRegistration,
} from "../services/registrationService";

function DashboardPage({ user }) {
  const [projects, setProjects] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [projectRegistrations, setProjectRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const userId = user?._id ?? user?.id;

  const isOwner = (project) => {
    const developerId =
      typeof project.developer === "object"
        ? project.developer?._id
        : project.developer;

    return (
      developerId &&
      userId &&
      String(developerId) === String(userId)
    );
  };

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const { data } = await getProjects();
      const projectList = Array.isArray(data) ? data : [];

      setProjects(projectList);

      const myResult = await getMyRegistrations();
      const myRegistrationList = Array.isArray(myResult.data)
        ? myResult.data
        : [];

      setMyRegistrations(myRegistrationList);

      // Load registrations for each project.
      // A failure on one project won't prevent the others from loading.
      const registrationResults = await Promise.all(
        projectList.map(async (project) => {
          try {
            const { data: registrations } =
              await getProjectRegistrations(project._id);

            return [
              project._id,
              Array.isArray(registrations) ? registrations : [],
            ];
          } catch {
            return [project._id, []];
          }
        })
      );

      setProjectRegistrations(
        Object.fromEntries(registrationResults)
      );
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "Could not load projects and registrations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const getMyRegistration = (projectId) =>
    myRegistrations.find((registration) => {
      const registeredProject =
        registration.projectReference?._id ??
        registration.projectReference;

      return String(registeredProject) === String(projectId);
    });

  const runRegistrationAction = async (
    key,
    action,
    successMessage
  ) => {
    setActionLoading((current) => ({
      ...current,
      [key]: true,
    }));
    setPageError("");
    setNotice("");

    try {
      await action();
      await loadProjects();
      setNotice(successMessage);
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "The registration action failed. Please try again."
      );
    } finally {
      setActionLoading((current) => ({
        ...current,
        [key]: false,
      }));
    }
  };

  const handleCreate = async (projectData) => {
    setSaving(true);
    setPageError("");

    try {
      await createProject(projectData);
      setShowForm(false);
      await loadProjects();
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "Could not create the project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (projectData) => {
    if (!editingProject) return;

    setSaving(true);
    setPageError("");

    try {
      await updateProject(editingProject._id, projectData);
      setEditingProject(null);
      await loadProjects();
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "Could not update the project."
      );
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
    setNotice("");

    try {
      await deleteProject(project._id);
      setProjects((current) =>
        current.filter((item) => item._id !== project._id)
      );
      setNotice("Project deleted.");
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "Could not delete this project."
      );
    }
  };

  const handleRegister = (project) =>
    runRegistrationAction(
      `register-${project._id}`,
      () => registerForProject(project._id),
      `Registration submitted for "${project.title}".`
    );

  const handleCancelRegistration = (
    registration,
    project
  ) => {
    const confirmed = window.confirm(
      `Cancel your registration for "${project.title}"?`
    );

    if (!confirmed) return;

    return runRegistrationAction(
      `cancel-${registration._id}`,
      () => deleteRegistration(registration._id),
      `Your registration for "${project.title}" was removed.`
    );
  };

  const handleApprove = (registration, project) =>
    runRegistrationAction(
      `approve-${registration._id}`,
      () => approveRegistration(registration._id),
      `Approved ${registration.userReference?.userName || "applicant"}.`
    );

  const handleReject = (registration, project) => {
    const confirmed = window.confirm(
      `Reject ${
        registration.userReference?.userName || "this applicant"
      } for "${project.title}"?`
    );

    if (!confirmed) return;

    return runRegistrationAction(
      `reject-${registration._id}`,
      () => rejectRegistration(registration._id),
      `Rejected ${
        registration.userReference?.userName || "applicant"
      }.`
    );
  };

  const isActionLoading = (key) => Boolean(actionLoading[key]);

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
            onClick={() => {
              setNotice("");
              setShowForm(true);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
          >
            + Create project
          </button>
        )}
      </header>

      {pageError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-red-700"
        >
          {pageError}
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-green-800"
        >
          {notice}
        </p>
      )}

      {showForm && (
        <section className="rounded-xl border p-5">
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
          {saving && (
            <p className="mt-2 text-sm">Saving project...</p>
          )}
        </section>
      )}

      {editingProject && (
        <section className="rounded-xl border p-5">
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProject(null)}
          />
          {saving && (
            <p className="mt-2 text-sm">Saving changes...</p>
          )}
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
            {projects.map((project) => {
              const owner = isOwner(project);
              const myRegistration = getMyRegistration(project._id);
              const registrations =
                projectRegistrations[project._id] ?? [];

              const participants = registrations.filter(
                (registration) =>
                  registration.registrationStatus === "approved" &&
                  registration.userReference
              );

              const pendingApplicants = owner
                ? registrations.filter(
                    (registration) =>
                      registration.registrationStatus === "pending"
                  )
                : [];

              const registrationKey = `register-${project._id}`;
              const cancelKey = myRegistration
                ? `cancel-${myRegistration._id}`
                : "";

              return (
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
                        ? "Open registration"
                        : "Requires approval"}
                    </p>
                  </div>

                  {/* Current user's registration */}
                  {!owner && (
                    <div className="mt-4 border-t pt-4">
                      {!myRegistration ? (
                        <button
                          disabled={isActionLoading(registrationKey)}
                          onClick={() => handleRegister(project)}
                          className="w-full rounded-lg bg-blue-600 px-3 py-2 font-medium text-white disabled:opacity-50"
                        >
                          {isActionLoading(registrationKey)
                            ? "Registering..."
                            : "Register for project"}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Your status:</strong>{" "}
                            <span
                              className={
                                myRegistration.registrationStatus ===
                                "approved"
                                  ? "font-medium text-green-700"
                                  : myRegistration.registrationStatus ===
                                      "pending"
                                    ? "font-medium text-amber-700"
                                    : "font-medium text-red-700"
                              }
                            >
                              {myRegistration.registrationStatus
                                .charAt(0)
                                .toUpperCase() +
                                myRegistration.registrationStatus.slice(1)}
                            </span>
                          </p>

                          <button
                            disabled={isActionLoading(cancelKey)}
                            onClick={() =>
                              handleCancelRegistration(
                                myRegistration,
                                project
                              )
                            }
                            className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                          >
                            {isActionLoading(cancelKey)
                              ? "Removing..."
                              : myRegistration.registrationStatus ===
                                  "approved"
                                ? "Leave project"
                                : myRegistration.registrationStatus ===
                                    "pending"
                                  ? "Cancel request"
                                  : "Remove rejected request"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Approved participants visible to everyone */}
                  <div className="mt-5 border-t pt-4">
                    <h4 className="font-semibold">
                      Participants ({participants.length})
                    </h4>

                    {participants.length === 0 ? (
                      <p className="mt-2 text-sm text-gray-500">
                        No approved participants yet.
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {participants.map((registration) => (
                          <li
                            key={registration._id}
                            className="rounded-lg bg-gray-50 p-3"
                          >
                            <p className="font-medium">
                              {registration.userReference.userName}
                            </p>

                            {registration.userReference.languages
                              ?.length > 0 && (
                              <p className="mt-1 text-xs text-gray-600">
                                Languages:{" "}
                                {registration.userReference.languages.join(
                                  ", "
                                )}
                              </p>
                            )}

                            {registration.userReference.frameworks
                              ?.length > 0 && (
                              <p className="mt-1 text-xs text-gray-600">
                                Frameworks:{" "}
                                {registration.userReference.frameworks.join(
                                  ", "
                                )}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Owner-only applicant management */}
                  {owner && (
                    <div className="mt-5 border-t pt-4">
                      <h4 className="font-semibold">
                        Pending applicants ({pendingApplicants.length})
                      </h4>

                      {pendingApplicants.length === 0 ? (
                        <p className="mt-2 text-sm text-gray-500">
                          No pending applications.
                        </p>
                      ) : (
                        <ul className="mt-3 space-y-3">
                          {pendingApplicants.map((registration) => {
                            const applicant =
                              registration.userReference;

                            return (
                              <li
                                key={registration._id}
                                className="rounded-lg border p-3"
                              >
                                <p className="font-medium">
                                  {applicant?.userName ||
                                    "Unknown applicant"}
                                </p>

                                {applicant?.languages?.length > 0 && (
                                  <p className="mt-1 text-xs text-gray-600">
                                    Languages:{" "}
                                    {applicant.languages.join(", ")}
                                  </p>
                                )}

                                {applicant?.frameworks?.length > 0 && (
                                  <p className="mt-1 text-xs text-gray-600">
                                    Frameworks:{" "}
                                    {applicant.frameworks.join(", ")}
                                  </p>
                                )}

                                {applicant?.interests?.length > 0 && (
                                  <p className="mt-1 text-xs text-gray-600">
                                    Interests:{" "}
                                    {applicant.interests.join(", ")}
                                  </p>
                                )}

                                <div className="mt-3 flex gap-2">
                                  <button
                                    disabled={isActionLoading(
                                      `approve-${registration._id}`
                                    )}
                                    onClick={() =>
                                      handleApprove(
                                        registration,
                                        project
                                      )
                                    }
                                    className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                                  >
                                    {isActionLoading(
                                      `approve-${registration._id}`
                                    )
                                      ? "Approving..."
                                      : "Approve"}
                                  </button>

                                  <button
                                    disabled={isActionLoading(
                                      `reject-${registration._id}`
                                    )}
                                    onClick={() =>
                                      handleReject(
                                        registration,
                                        project
                                      )
                                    }
                                    className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
                                  >
                                    {isActionLoading(
                                      `reject-${registration._id}`
                                    )
                                      ? "Rejecting..."
                                      : "Reject"}
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Existing project owner controls */}
                  {owner && (
                    <div className="mt-5 flex gap-3 border-t pt-4">
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setEditingProject(project);
                          setNotice("");
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
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;
