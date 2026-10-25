
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { getRecommendations } from "../services/recommendationService";

function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecommendationsPage;
