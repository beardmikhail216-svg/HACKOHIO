function ProjectCard({ project }) {
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
        </div>
    );
}

export default ProjectCard;