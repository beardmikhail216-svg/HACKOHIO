const Registration = require("../models/Registration");
const Project = require("../models/Project");

async function createRegistration(req, res) {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        //Check for existing registration
        const existingRegistration = await Registration.findOne({
            userReference: req.user.id,
            projectReference: projectId
        });

        if (existingRegistration) {
            return res.status(409).json({
                message: "User is already registered for this project"
            });
        }

        // count confirmations
        const confirmedRegistrations = await Registration.countDocuments({
            projectReference: projectId,
            registrationStatus: "confirmed"
        });

        // registration status?
        // const registrationStatus = project.registrationMode === "approval" ? "pending" : "confirmed";
        let registrationStatus;
        if (project.registrationMode === "approval") {
            registrationStatus = "pending";
        } else {
            registrationStatus = "confirmed";
        }

        // create registration
        const registration = await Registration.create({
            userReference: req.user.id,
            projectReference: projectId,
            registrationStatus
        });

        return res.status(201).json({ registration });
    } catch (error) {
        console.error("Error creating registration:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = { createRegistration };