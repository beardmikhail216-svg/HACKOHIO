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

        // registration status?
        // const registrationStatus = project.registrationMode === "approval" ? "pending" : "confirmed";
        let registrationStatus;
        if (project.registrationMode === "approval") {
            registrationStatus = "pending";
        } else {
            registrationStatus = "approved";
        }

        // create registration
        const registration = await Registration.create({
            userReference: req.user.id,
            projectReference: projectId,
            registrationStatus
        });

        return res.status(201).json({ registration });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User is already registered for this project"
            });
        }
        
        console.error("Error creating registration:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}
    async function getMyRegistrations(req, res) {
        try {
            const registrations = await Registration.find({ userReference: req.user.id }).populate("projectReference").sort({ createdAt: -1 }); //asc ord
            res.status(200).json(registrations);
        } catch (error) {
            console.error("Error fetching registrations:", error);
            
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
    async function getProjectRegistrations(req, res) {
        try {
            const { projectId } = req.params;
            const registrations = await Registration.find({ 
                projectReference: projectId }).populate("userReference", "userName languages frameworks interests");
            // if (registrations.length === 0) {
            //     return res.status(404).json({
            //         message: "Registration not found"
            //     });
            // }
            res.status(200).json(registrations);
        } catch (error) {
            console.error("Error fetching registrations:", error);
            
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
    async function deleteRegistration(req, res) {
        try {
            const registration = await Registration.findById(req.params.id);
    
            if (!registration) {
                return res.status(404).json({
                    message: "Registration not found"
                });
            }
    
            //objectId to String since req.user.id is a string
            if (registration.userReference.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "You are not the owner of this registration"
                });
            }
    
            await Registration.findByIdAndDelete(req.params.id);
    
            res.status(200).json({ deletedRegistration: registration });
        } catch (error) {
            console.error("Error deleting registration:", error);

            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
    async function approveRegistration(req, res) {
        try {
            const registration = await Registration.findById(req.params.id).populate("projectReference");

            if (!registration) {
                return res.status(404).json({
                    message: "Registration not found"
                });
            }

            if (registration.projectReference.developer.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "You are not the developer of this project"
                });
            }

            registration.registrationStatus = "approved";
            await registration.save();

            res.status(200).json({ approvedRegistration: registration });
        } catch (error) {
            console.error("Error approving registration:", error);

            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
    async function rejectRegistration(req, res) {
        try {
            const registration = await Registration.findById(req.params.id).populate("projectReference");

            if (!registration) {
                return res.status(404).json({
                    message: "Registration not found"
                });
            }

            if (registration.projectReference.developer.toString() !== req.user.id) {
                return res.status(403).json({
                    message: "You are not the developer of this project"
                });
            }

            registration.registrationStatus = "rejected";
            await registration.save();

            res.status(200).json({ rejectedRegistration: registration });
        } catch (error) {
            console.error("Error rejecting registration:", error);

            res.status(500).json({
                message: "Internal server error"
            });
        }
    }

module.exports = { 
    createRegistration, 
    getMyRegistrations, 
    getProjectRegistrations, 
    deleteRegistration, 
    approveRegistration, 
    rejectRegistration };