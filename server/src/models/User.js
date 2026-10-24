const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    languages: { type: String, enum: [
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
        "Swift", 
        "none"], default: "none" },
        frameworks: { type: String, enum: [
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
            "TensorFlow", 
            "none"], default: "none" },
            databases: { type: String, enum: [
                "MySQL",
                "PostgreSQL",
                "MongoDB",
                "SQLite",
                "Redis",
                "none"], default: "none" }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);