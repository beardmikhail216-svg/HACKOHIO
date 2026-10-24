const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: [String], required: true },
    languages: { type: [String], enum: [
        "Python", 
        "JavaScript", 
        "Java", 
        "TypeScript", 
        "C/C++", 
        "SQL", 
        "C#", 
        "Ruby", 
        "Go", 
        "Rust", 
        "Kotlin", 
        "Swift",], default: [] },
    frameworks: { type: [String], enum: [
            "React", 
            "Angular", 
            "Vue", 
            "Svelte", 
            "Ext JS",
            "Django", 
            "Express.js", 
            "Laravel", 
            "Rails", 
            "ASP.NET Core", 
            "FastAPI", 
            "Spring Boot",
            "Flutter", 
            "SwiftUI",
            "Next.js", 
            "Nuxt", 
            "SvelteKit",
            "TensorFlow",], default: [] },
    databases: { type: [String], enum: [
                "MySQL",
                "PostgreSQL",
                "MongoDB",
                "SQLite",
                "Redis",], default: [] },
    topics: { type: [String], enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "Artificial Intelligence",
        "Game Development",
        "DevOps",
        "Cybersecurity",
        "Blockchain",
        "Cloud Computing",
        "IoT",
        "AR/VR",
        "Robotics",
        "Embedded Systems",
        "Quantum Computing",
    ], default: [] },
    date: { type: Date, required: true },
    developer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    registrationMode: {
        type: String,
        default: "approval"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Project", projectSchema);