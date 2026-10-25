const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    email: { type: String, required: true, unique: true, lowercase:true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
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
    interests: { type: [String], enum: [
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
    avatarIcon: {
        type: String,
        enum: ["user", "code", "rocket", "gamepad", "brain", "palette"],
        default: "user",
    },
        avatarColor: {
        type: String,
        enum: ["blue", "purple", "green", "orange", "pink", "gray"],
        default: "blue",
    },
    linkedin: {
    type: String,
    trim: true,
    default: ""
    },
    github: {
        type: String,
        trim: true,
        default: ""
    },
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);