
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { getRecommendations } from "../services/recommendationService";

function RecommendationsPage() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("All");
    const [minScore, setMinScore] = useState(0);
    const [sortOrder, setSortOrder] = useState("highest");

    useEffect(() => {
        let active = true;

        async function loadRecommendations() {
            try {
                const { data } = await getRecommendations();

                if (active) {
                    setRecommendations(
                        Array.isArray(data) ? data : []
                    );
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Could not load recommendations."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadRecommendations();

        return () => {
            active = false;
        };
    }, []);

    const availableSkills = [
        ...new Set(
            recommendations.flatMap((project) => [
                ...(project.languages || []),
                ...(project.frameworks || []),
                ...(project.databases || [])
            ])
        )
    ].sort();

    const filteredProjects = recommendations
        .filter((project) => {
            const skills = [
                ...(project.languages || []),
                ...(project.frameworks || []),
                ...(project.databases || [])
            ];

            const matchesSkill =
                selectedSkill === "All" ||
                skills.includes(selectedSkill);

            const matchesScore = project.matchScore >= minScore;

            return matchesSkill && matchesScore;
        })
        .sort((a, b) =>
            sortOrder === "highest"
                ? b.matchScore - a.matchScore
                : a.matchScore - b.matchScore
        );

    if (loading) {
        return <p className="p-6">Loading recommendations...</p>;
    }

    return (
        <section>
            <h2 className="mb-2 text-2xl font-semibold">
                Recommended for you
            </h2>

            <p className="mb-6 text-gray-600">
                Projects ranked based on your skills and interests.
            </p>

            <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Filter Recommendations
                    </h3>

                    <button
                        onClick={() => {
                            setSelectedSkill("All");
                            setMinScore(0);
                            setSortOrder("highest");
                        }}
                        className="text-sm font-medium text-blue-700 hover:underline"
                    >
                        Reset Filters
                    </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="skill-filter"
                            className="mb-2 block text-sm font-medium"
                        >
                            Filter by Skill
                        </label>

                        <select
                            id="skill-filter"
                            value={selectedSkill}
                            onChange={(e) => setSelectedSkill(e.target.value)}
                            className="w-full rounded-lg border p-2"
                        >
                            <option value="All">All Skills</option>

                            {availableSkills.map((skill) => (
                                <option key={skill} value={skill}>
                                    {skill}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="sort-order"
                            className="mb-2 block text-sm font-medium"
                        >
                            Sort by Match
                        </label>

                        <select
                            id="sort-order"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full rounded-lg border p-2"
                        >
                            <option value="highest">Highest Match First</option>
                            <option value="lowest">Lowest Match First</option>
                        </select>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                        <label
                            htmlFor="score-filter"
                            className="text-sm font-medium"
                        >
                            Minimum Match Score
                        </label>

                        <span className="text-sm font-semibold">
                            {minScore}%
                        </span>
                    </div>

                    <input
                        id="score-filter"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="w-full accent-blue-700"
                    />
                </div>
            </div>

            {error && (
                <p
                    role="alert"
                    className="mb-4 rounded-lg bg-red-50 p-3 text-red-700"
                >
                    {error}
                </p>
            )}

            {!error && recommendations.length === 0 && (
                <p className="rounded-xl border border-dashed p-8 text-center text-gray-600">
                    No recommendations available yet.
                </p>
            )}

            {!error && recommendations.length > 0 && (
                <>
                    <p className="mb-4 text-sm text-gray-600">
                        Showing {filteredProjects.length} of {recommendations.length} projects
                    </p>

                    {filteredProjects.length === 0 ? (
                        <p className="rounded-xl border border-dashed p-8 text-center text-gray-600">
                            No projects match your selected filters.
                            Try adjusting your filters.
                        </p>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default RecommendationsPage;
