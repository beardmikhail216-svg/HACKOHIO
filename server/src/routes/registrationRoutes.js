const express = require("express");
const requireAuth = require("../middleware/authMiddleware");

const {
    createRegistration,
    getMyRegistrations,
    getProjectRegistrations,
    deleteRegistration,
    approveRegistration,
    rejectRegistration
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/:projectId", requireAuth, createRegistration);
router.get("/", requireAuth, getMyRegistrations);
router.get("/project/:projectId", requireAuth, getProjectRegistrations);
router.delete("/:id", requireAuth, deleteRegistration);
router.put("/:id/approve", requireAuth, approveRegistration);
router.put("/:id/reject", requireAuth, rejectRegistration);

module.exports = router;