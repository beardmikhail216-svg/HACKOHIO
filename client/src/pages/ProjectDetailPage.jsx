
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProject } from "../services/projectService";

import {
  registerForProject,
  getMyRegistrations,
  getProjectRegistrations,
  deleteRegistration,
  approveRegistration,
  rejectRegistration,
} from "../services/registrationService";

function ProjectDetailPage({ user }) {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const userId = user?._id ?? user?.id;

  const isOwner = useCallback(
    (item) => {
      const developerId =
        typeof item?.developer === "object"
          ? item.developer?._id
          : item?.developer;

      return (
        developerId &&
        userId &&
        String(developerId) === String(userId)
      );
    },
    [userId]
  );

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const [projectResult, myResult, registrationsResult] =
        await Promise.all([
          getProject(projectId),
          getMyRegistrations(),
          getProjectRegistrations(projectId),
        ]);

      const projectData =
        projectResult.data?.project ?? projectResult.data;

      if (!projectData?._id) {
        throw new Error("Project not found.");
      }

      setProject(projectData);

      setMyRegistrations(
        Array.isArray(myResult.data) ? myResult.data : []
      );

      setRegistrations(
        Array.isArray(registrationsResult.data)
          ? registrationsResult.data
          : []
      );

      return true;
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          error.message ||
          "Could not load this project."
      );

      return false;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const myRegistration = myRegistrations.find((registration) => {
    const registeredProject =
      registration.projectReference?._id ??
      registration.projectReference;

    return String(registeredProject) === String(projectId);
  });

  const owner = isOwner(project);

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

  const performAction = async (action, successMessage) => {
    setActionLoading(true);
    setPageError("");
    setNotice("");

    try {
      await action();

      const refreshed = await loadDetails();

      if (refreshed) {
        setNotice(successMessage);
      } else {
        setPageError(
          "The action may have succeeded, but the page could not refresh. Please reload."
        );
      }
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          "The action failed. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegister = () =>
    performAction(
      () => registerForProject(projectId),
      "Your registration was submitted."
    );

  const handleCancelRegistration = async () => {
    if (!myRegistration) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove your registration?"
    );

    if (!confirmed) return;

    await performAction(
      () => deleteRegistration(myRegistration._id),
      "Your registration was removed."
    );
  };

  const handleApprove = (registration) =>
    performAction(
      () => approveRegistration(registration._id),
      `Approved ${registration.userReference?.userName || "applicant"}.`
    );

  const handleReject = async (registration) => {
    const confirmed = window.confirm(
      `Reject ${
        registration.userReference?.userName || "this applicant"
      }?`
    );

    if (!confirmed) return;

    await performAction(
      () => rejectRegistration(registration._id),
      "The application was rejected."
    );
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p>Loading project...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-5xl space-y-4 p-6">
        <p role="alert" className="text-red-700">
          {pageError || "Project not found."}
        </p>

        <Link to="/" className="text-blue-700 hover:underline">
          ← Back to projects
        </Link>
      </main>
    );
  }

  const developer =
    project.developer && typeof project.developer === "object"
      ? project.developer
      : null;

  const technologyGroups = [
    ["Languages", project.languages],
    ["Frameworks", project.frameworks],
    ["Databases", project.databases],
    ["Topics", project.topics],
  ];

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <Link
        to="/"
        className="inline-block text-sm font-medium text-blue-700 hover:underline"
      >
        ← Back to projects
      </Link>

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

      <section className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
              Project details
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {project.title}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Created by{" "}
              {developer?.userName ||
                (owner ? user?.userName : "Project owner")}
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
            {project.registrationMode === "open"
              ? "Open registration"
              : "Approval required"}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">
            About this project
          </h2>

          <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
            {Array.isArray(project.description)
              ? project.description.join("\n")
              : project.description || "No description provided."}
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {technologyGroups.map(([label, values]) => (
            <div key={label}>
              <h3 className="font-semibold">{label}</h3>

              {Array.isArray(values) && values.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {values.map((value, index) => (
                    <span
                      key={`${value}-${index}`}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Not specified
                </p>
              )}
            </div>
          ))}
        </div>

        {project.date && (
          <p className="mt-6 text-sm text-gray-600">
            <strong>Project date:</strong>{" "}
            {new Date(project.date).toLocaleDateString()}
          </p>
        )}

        {!owner && (
          <div className="mt-8 border-t pt-6">
            {myRegistration ? (
              <div className="space-y-3">
                <p>
                  Your registration status:{" "}
                  <strong className="capitalize">
                    {myRegistration.registrationStatus}
                  </strong>
                </p>

                <button
                  onClick={handleCancelRegistration}
                  disabled={actionLoading}
                  className="rounded-lg border px-4 py-2 disabled:opacity-50"
                >
                  {actionLoading
                    ? "Please wait..."
                    : myRegistration.registrationStatus === "approved"
                      ? "Leave project"
                      : "Remove registration"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={actionLoading}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading
                  ? "Please wait..."
                  : "Register for this project"}
              </button>
            )}
          </div>
        )}

        {owner && (
          <p className="mt-8 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
            You own this project. You can review applications below.
            Project editing and deletion remain available from the dashboard.
          </p>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">
          Participants ({participants.length})
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Approved members of this project.
        </p>

        {participants.length === 0 ? (
          <p className="mt-4 text-gray-500">
            No approved participants yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {participants.map((registration) => {
              const participant = registration.userReference;

              return (
                <article
                  key={registration._id}
                  className="rounded-xl border p-4"
                >
                  <h3 className="font-semibold">
                    {participant.userName || "Project participant"}
                    {String(participant._id ?? participant.id) === String(user?._id ?? user?.id) && " (You)"}
                  </h3>

                  {participant.languages?.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>Languages:</strong>{" "}
                      {participant.languages.join(", ")}
                    </p>
                  )}

                  {participant.frameworks?.length > 0 && (
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Frameworks:</strong>{" "}
                      {participant.frameworks.join(", ")}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {owner && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Pending applications ({pendingApplicants.length})
          </h2>

          {pendingApplicants.length === 0 ? (
            <p className="mt-3 text-gray-500">
              No pending applications.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {pendingApplicants.map((registration) => {
                const applicant = registration.userReference;

                return (
                  <article
                    key={registration._id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {applicant?.userName || "Unknown applicant"}
                      </h3>

                      {applicant?.languages?.length > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          Languages: {applicant.languages.join(", ")}
                        </p>
                      )}

                      {applicant?.frameworks?.length > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          Frameworks: {applicant.frameworks.join(", ")}
                        </p>
                      )}

                      {applicant?.interests?.length > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          Interests: {applicant.interests.join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(registration)}
                        disabled={actionLoading}
                        className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(registration)}
                        disabled={actionLoading}
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default ProjectDetailPage;
