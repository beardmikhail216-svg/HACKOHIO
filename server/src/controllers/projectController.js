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
        const { title, description, date, registrationMode } = req.body;
        const project = new Project({
            title,
            description,
            languages: req.body.languages,
            frameworks: req.body.frameworks,
            databases: req.body.databases,
            topics: req.body.topics,
            date,
            developer: req.user.id,
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
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        //objectId to String since req.user.id is a string
        if (project.developer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not the developer of this project"
            });
        }

        if (req.body.title !== undefined) project.title = req.body.title;
        if (req.body.description !== undefined) project.description = req.body.description;
        if (req.body.date !== undefined) project.date = req.body.date;
        if (req.body.languages !== undefined) project.languages = req.body.languages;
        if (req.body.frameworks !== undefined) project.frameworks = req.body.frameworks;
        if (req.body.databases !== undefined) project.databases = req.body.databases;
        if (req.body.topics !== undefined) project.topics = req.body.topics;
        if (req.body.registrationMode !== undefined) { project.registrationMode = req.body.registrationMode;}
        
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
        if (project.developer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not the developer of this project"
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