const {
    calculateMatch,
    rankProjects
} = require("./matchingService");

const user = {
    userName: "Alex",
    languages: ["Python", "JavaScript"],
    frameworks: ["React"],
    databases: ["MongoDB"],
    interests: ["Artificial Intelligence", "Web Development"]
};

const projects = [
    {
        title: "AI Study Assistant",
        languages: ["Python"],
        frameworks: [],
        databases: [],
        topics: ["Artificial Intelligence"]
    },
    {
        title: "Web Development Tracker",
        languages: ["JavaScript"],
        frameworks: ["React"],
        databases: ["MongoDB"],
        topics: ["Web Development"]
    },
    {
        title: "Java Game",
        languages: ["Java"],
        frameworks: [],
        databases: [],
        topics: ["Game Development"]
    }
];

console.log("First project score:");
console.log(calculateMatch(user, projects[0]));

console.log("\nRanked projects:");
console.log(rankProjects(user, projects));