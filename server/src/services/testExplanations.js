
const {
    rankProjects
} = require("./matchingService");

const user = {
    interests: ["Robotics", "AI"],
    languages: ["Python", "Java"],
    frameworks: [],
    databases: []
};

const projects = [
    {
        title: "Robot Dashboard",
        topics: ["Robotics"],
        languages: ["Python"],
        frameworks: ["React"],
        databases: ["MongoDB"]
    },
    {
        title: "Finance Website",
        topics: ["Finance"],
        languages: ["JavaScript"],
        frameworks: ["React"],
        databases: ["PostgreSQL"]
    }
];

const results = rankProjects(user, projects);

console.log(JSON.stringify(results, null, 2));
