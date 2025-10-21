const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const { auth } = require("../middleware/auth");

// All project routes require authentication
router.use(auth);

// Get all projects for the user
router.get("/", projectController.GetProjects);

// Create a new project
router.post("/", projectController.CreateProject);

// Get a specific project
router.get("/:projectSlug", projectController.GetProject);

// Update a project
router.put("/:projectSlug", projectController.UpdateProject);

// Delete a project
router.delete("/:projectSlug", projectController.DeleteProject);

// Update project files
router.put("/:projectSlug/files", projectController.UpdateProjectFiles);

// File CRUD operations
router.post("/:projectSlug/files", projectController.CreateFile);
router.get("/:projectSlug/files/:fileId", projectController.GetFile);
router.put("/:projectSlug/files/:fileId", projectController.UpdateFile);
router.delete("/:projectSlug/files/:fileId", projectController.DeleteFile);

module.exports = router;
