const express = require("express");
const requireAuth = require("../middleware/authMiddleware");

const {
    createRegistration
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/:projectId", requireAuth, createRegistration);

module.exports = router;