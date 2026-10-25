function ProjectCard({ project }) {
    const details = project.matchDetails;

    const sharedSkills = [
        ...(details?.sharedLanguages || []),
        ...(details?.sharedFrameworks || []),
        ...(details?.sharedDatabases || [])
    ];

    const newSkills = [
        ...(details?.newLanguages || []),
        ...(details?.newFrameworks || []),
        ...(details?.newDatabases || [])
    ];

    return (
        <div className="rounded-xl border p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                    {project.title}
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                    {project.matchScore}% Match
                </span>
            </div>

            <p className="mt-2 text-gray-600">
                {Array.isArray(project.description)
                    ? project.description.join(" ")
                    : project.description}
            </p>

            <div className="mt-4 space-y-2 text-sm">
                <p>
                    <strong>Languages:</strong>{" "}
                    {project.languages?.join(", ") || "None"}
                </p>

                <p>
                    <strong>Frameworks:</strong>{" "}
                    {project.frameworks?.join(", ") || "None"}
                </p>

                <p>
                    <strong>Databases:</strong>{" "}
                    {project.databases?.join(", ") || "None"}
                </p>

                <p>
                    <strong>Topics:</strong>{" "}
                    {project.topics?.join(", ") || "None"}
                </p>
            </div>
            {details && (
                <div className="mt-4 border-t pt-4 text-sm">

                    <h3 className="font-semibold text-gray-800">
                        {details.sharedTopics?.length > 0 ||
                            sharedSkills.length > 0
                            ? "Why this matches you"
                            : "Explore something new"}
                    </h3>

                    {details.sharedTopics?.length > 0 && (
                        <p className="mt-2 text-green-700">
                            Matching interests:{" "}
                            {details.sharedTopics.join(", ")}
                        </p>
                    )}

                    {sharedSkills.length > 0 && (
                        <p className="mt-2 text-green-700">
                            Skills you already know:{" "}
                            {sharedSkills.join(", ")}
                        </p>
                    )}

                    {newSkills.length > 0 && (
                        <p className="mt-2 text-blue-700">
                            Potential skills to explore:{" "}
                            {newSkills.join(", ")}
                        </p>
                    )}

                    {details.sharedTopics?.length === 0 &&
                        sharedSkills.length === 0 && (
                            <p className="mt-2 text-gray-500">
                                This project could introduce you
                                to new topics and technologies.
                            </p>
                        )}

                </div>
            )}

        </div>
    );
}

export default ProjectCard;