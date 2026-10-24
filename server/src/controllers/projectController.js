const Project = require("../models/Project");

async function getProjects(req, res) {
    try {
        const projects = await Project.find().sort({ date: 1}); //asc ord
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getProjectById(req,res) {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function createProject(req, res) {
    try {
        const { title, description, date, location, capacity, registrationMode } = req.body;
        const project = new Project({
            title,
            description,
            date,
            location,
            capacity,
            organizer: req.user.id,
            registrationMode
        });

        await project.save();

        res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        console.error("Error creating project:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function updateProject(req, res) {
    try {
        const { title, description, date, location, capacity } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        //objectId to String since req.user.id is a string
        if (project.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not the organizer of this project"
            });
        }

        project.title = title;
        project.description = description;
        project.date = date;
        project.location = location;
        project.capacity = capacity;

        await project.save();

        res.status(200).json({ updatedProject: project });
    } catch (error) {
        console.error("Error updating project:", error);
        
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteProject(req, res) {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        //objectId to String since req.user.id is a string
        if (project.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not the organizer of this project"
            });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({ deletedProject: project });
    } catch (error) {
        console.error("Error deleting project:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};