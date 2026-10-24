const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Project = require("../models/Project");

const { rankProjects } = require("../services/matchingService");

// GET /api/recommendations
router.get("/", requireAuth, async (req, res) => {
    try {
        // Find the currently logged-in user
        const user = await User.findById(req.user.id)
            .select("-password")
            .lean();

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Exclude projects created by the current user
        const projects = await Project.find({
            developer: { $ne: user._id }
        }).lean();

        // Calculate and return ranked recommendations
        const recommendations = rankProjects(user, projects);

        return res.status(200).json(recommendations);

    } catch (error) {
        console.error("Error generating recommendations:", error);

        return res.status(500).json({
            message: "Failed to generate recommendations"
        });
    }
});

module.exports = router;