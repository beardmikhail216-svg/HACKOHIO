function ProjectCard({ project }) {
    return (
        <div className="project-card">
            <h2>{project.title}</h2>

            <p>{project.description?.join(" ")}</p>

            <h3>Match Score: {project.matchScore}%</h3>

            <p>Languages: {project.languages?.join(", ") || "None"}</p>

            <p>Frameworks: {project.frameworks?.join(", ") || "None"}</p>

            <p>Topics: {project.topics?.join(", ") || "None"}</p>
        </div>
    );
}

export default ProjectCard;