const express = require("express");
const requireAuth = require("../middleware/authMiddleware");

const {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateProfile);

module.exports = router;