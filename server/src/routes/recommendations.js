
const express = require("express");
const router = express.Router();

// Import the MongoDB models
const User = require("../models/User");
const Project = require("../models/Project");

// Import existing algorithm
const { rankProjects } = require("../services/matchingService");

// GET /api/recommendations/:userId
router.get("/:userId", async (req, res) => {
    try {
        // 1. Find the student in MongoDB
        const user = await User.findById(req.params.userId)
            .select("-password")
            .lean();

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 2. Find all available projects
        const projects = await Project.find({
    developer: { $ne: user._id }
}).lean();

        // 3. Calculate compatibility scores
        const recommendations = rankProjects(user, projects);

        // 4. Send the ranked projects to the frontend
        res.json(recommendations);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to generate recommendations"
        });
    }
});

module.exports = router;
