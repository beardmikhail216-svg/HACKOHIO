const express = require("express");
const requireAuth = require("../middleware/authMiddleware");

const {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    getUserProfile
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateProfile);
router.get("/:userId", getUserProfile);

module.exports = router;