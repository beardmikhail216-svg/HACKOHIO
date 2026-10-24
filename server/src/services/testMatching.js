
const {
    calculateMatch,
    rankProjects
} = require("./matchingService");

const user = {
    userName: "Alex",
    languages: ["Python", "JavaScript"],
    frameworks: ["React"],
    databases: ["MongoDB"],
    interests: ["AI", "Sustainability"]
};

const projects = [
    {
        name: "AI Study Assistant",
        languages: ["Python"],
        frameworks: [],
        databases: [],
        topics: ["AI"]
    },
    {
        name: "Sustainability Tracker",
        languages: ["JavaScript"],
        frameworks: ["React"],
        databases: ["MongoDB"],
        topics: ["Sustainability"]
    },
    {
        name: "Java Game",
        languages: ["Java"],
        frameworks: [],
        databases: [],
        topics: ["Gaming"]
    }
];

console.log("First project score:");
console.log(calculateMatch(user, projects[0]));

console.log("\nRanked projects:");
console.log(rankProjects(user, projects));