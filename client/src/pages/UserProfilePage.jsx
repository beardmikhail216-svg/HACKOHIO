import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserProfile } from "../services/authService";

const AVATARS = {
    user: "👤",
    code: "💻",
    rocket: "🚀",
    gamepad: "🎮",
    brain: "🧠",
    palette: "🎨"
};

const COLORS = {
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    green: "bg-green-100",
    orange: "bg-orange-100",
    pink: "bg-pink-100",
    gray: "bg-gray-100"
};

function ProfileSection({ title, items }) {
    return (
        <section className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">{title}</h2>

            {items?.length ? (
                <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                        <span
                            key={item}
                            className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">
                    Nothing added yet.
                </p>
            )}
        </section>
    );
}

export default function UserProfilePage() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        setProfile(null);
        setError("");
        setLoading(true);

        getUserProfile(userId)
            .then(({ data }) => {
                if (active) setProfile(data.user);
            })
            .catch((err) => {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load this profile."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [userId]);

    if (loading) {
        return <p className="p-8">Loading profile...</p>;
    }

    if (error || !profile) {
        return (
            <main className="mx-auto max-w-3xl p-8">
                <p className="mb-4 text-red-600">
                    {error || "User not found."}
                </p>
                <Link to="/" className="text-blue-600 hover:underline">
                    Back to projects
                </Link>
            </main>
        );
    }

    const avatarColor = COLORS[profile.avatarColor] || COLORS.blue;
    const avatarIcon = AVATARS[profile.avatarIcon] || AVATARS.user;

    return (
        <main className="mx-auto max-w-3xl space-y-6 p-6">
            <Link
                to="/"
                className="text-sm text-blue-600 hover:underline"
            >
                ← Back to projects
            </Link>

            <section className="flex items-center gap-5 rounded-xl border bg-white p-6">
                <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-4xl ${avatarColor}`}
                >
                    {avatarIcon}
                </div>

                <div>
                    <h1 className="text-2xl font-bold">
                        {profile.userName}
                    </h1>
                    <p className="text-gray-500">ProjectHub member</p>
                </div>
            </section>
            
            <section className="rounded-xl border bg-white p-5">
                <h2 className="mb-3 text-lg font-semibold">
                    Connect
                </h2>

                <div className="flex flex-wrap gap-4">
                    {profile.linkedin && (
                        <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            LinkedIn ↗
                        </a>
                    )}

                    {profile.github && (
                        <a
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-800 hover:underline"
                        >
                            GitHub ↗
                        </a>
                    )}

                    {!profile.linkedin && !profile.github && (
                        <p className="text-sm text-gray-500">
                            No social links added yet.
                        </p>
                    )}
                </div>
            </section>


            <ProfileSection
                title="Languages"
                items={profile.languages}
            />

            <ProfileSection
                title="Frameworks"
                items={profile.frameworks}
            />

            <ProfileSection
                title="Databases"
                items={profile.databases}
            />

            <ProfileSection
                title="Interests"
                items={profile.interests}
            />
        </main>
    );
}