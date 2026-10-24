
import ProjectCard from "../components/ProjectCard";

function RecommendationsPage() {
    const projects = [
        {
            _id: "1",
            title: "AI Study Assistant",
            description: ["Build an AI study assistant"],
            languages: ["Python"],
            frameworks: [],
            topics: ["Artificial Intelligence"],
            matchScore: 100
        },
        {
            _id: "2",
            title: "Web Development Tracker",
            description: ["Build a full-stack web app"],
            languages: ["JavaScript"],
            frameworks: ["React"],
            topics: ["Web Development"],
            matchScore: 85
        }
    ];

    return (
        <div>
            <h1>Recommended Projects</h1>

            {projects.map(project => (
                <ProjectCard
                    key={project._id}
                    project={project}
                />
            ))}
        </div>
    );
}

export default RecommendationsPage;
