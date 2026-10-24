const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
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
                "none"], default: "none" },
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