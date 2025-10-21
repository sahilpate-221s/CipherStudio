const mongoose = require("mongoose");
const Project = require("../models/project.models");
const File = require("../models/files.models");

// Get all projects for a user
exports.GetProjects = async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ projects });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in get projects" });
  }
};

// Create a new project
exports.CreateProject = async (req, res) => {
  try {
    const { projectName, description, projectSlug } = req.body;
    const userId = req.userId;

    if (!projectName || !projectSlug) {
      return res
        .status(400)
        .json({ message: "Project name and slug are required" });
    }

    // Check if slug is unique
    const existingProject = await Project.findOne({ projectSlug });
    if (existingProject) {
      return res.status(400).json({ message: "Project slug already exists" });
    }

    // Create project first
    const newProject = new Project({
      projectSlug,
      userId,
      projectName,
      description,
    });

    await newProject.save();

    // Create default files in Files collection
    const defaultFiles = [
      // Root folder (project name)
      {
        projectId: newProject._id,
        parentId: null,
        name: projectName,
        type: "folder",
      },
      // src folder
      {
        projectId: newProject._id,
        parentId: null, // Will be set to root folder after creation
        name: "src",
        type: "folder",
      },
      // public folder
      {
        projectId: newProject._id,
        parentId: null, // Will be set to root folder after creation
        name: "public",
        type: "folder",
      },
      // package.json
      {
        projectId: newProject._id,
        parentId: null, // At root level
        name: "package.json",
        type: "file",
        content: JSON.stringify(
          {
            name: projectName.toLowerCase().replace(/\s+/g, "-"),
            version: "0.1.0",
            private: true,
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
            },
            devDependencies: {
              "@types/react": "^18.2.0",
              "@types/react-dom": "^18.2.0",
              "@vitejs/plugin-react": "^4.0.0",
              vite: "^4.3.9",
            },
            scripts: {
              dev: "vite",
              build: "vite build",
              preview: "vite preview",
            },
            eslintConfig: {
              extends: ["react-app"],
            },
          },
          null,
          2
        ),
      },
      // app.js
      {
        projectId: newProject._id,
        parentId: null, // Will be set to src folder
        name: "app.js",
        type: "file",
        content: `
import React from "react";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Hello from CipherStudio 👋</h1>
      <p>This is a React app!</p>
    </div>
  );
}

export default App;
        `.trim(),
      },
      // index.css
      {
        projectId: newProject._id,
        parentId: null, // Will be set to src folder
        name: "index.css",
        type: "file",
        content: `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
        `.trim(),
      },
      // main.js
      {
        projectId: newProject._id,
        parentId: null, // Will be set to src folder
        name: "main.js",
        type: "file",
        content: `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.js";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
        `.trim(),
      },
      // index.html
      {
        projectId: newProject._id,
        parentId: null, // Will be set to public folder
        name: "index.html",
        type: "file",
        content: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CipherStudio App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
        `.trim(),
      },
    ];

    const createdFiles = await File.insertMany(defaultFiles);

    // Update parentIds
    const rootFolder = createdFiles.find((f) => f.name === projectName);
    const srcFolder = createdFiles.find((f) => f.name === "src");
    const publicFolder = createdFiles.find((f) => f.name === "public");
    const packageJson = createdFiles.find((f) => f.name === "package.json");
    const appJs = createdFiles.find((f) => f.name === "app.js");
    const indexCss = createdFiles.find((f) => f.name === "index.css");
    const mainJs = createdFiles.find((f) => f.name === "main.js");
    const indexHtml = createdFiles.find((f) => f.name === "index.html");

    // Set parentIds
    await File.findByIdAndUpdate(packageJson._id, { parentId: rootFolder._id });
    await File.findByIdAndUpdate(srcFolder._id, { parentId: rootFolder._id });
    await File.findByIdAndUpdate(publicFolder._id, {
      parentId: rootFolder._id,
    });
    await File.findByIdAndUpdate(appJs._id, { parentId: srcFolder._id });
    await File.findByIdAndUpdate(indexCss._id, { parentId: srcFolder._id });
    await File.findByIdAndUpdate(mainJs._id, { parentId: srcFolder._id });
    await File.findByIdAndUpdate(indexHtml._id, { parentId: publicFolder._id });

    return res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in create project" });
  }
};

// Get a specific project
exports.GetProject = async (req, res) => {
  try {
    const { projectSlug } = req.params;
    const userId = req.userId;

    const project = await Project.findOne({ projectSlug, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch files from Files collection and build tree structure
    const files = await File.find({ projectId: project._id }).sort({
      createdAt: 1,
    });

    // Build tree structure, starting from root's children to exclude root folder
    const buildTree = (parentId = null, parentPath = "") => {
      const children = files.filter(
        (f) => f.parentId?.toString() === parentId?.toString()
      );
      return children.map((child) => {
        const currentPath = parentPath ? `${parentPath}/${child.name}` : child.name;
        return {
          id: child._id.toString(),
          name: child.name,
          type: child.type,
          path: currentPath,
          children: child.type === "folder" ? buildTree(child._id, currentPath) : undefined,
        };
      });
    };

    // Find the root folder and build tree from its children
    const rootFolder = files.find(f => f.parentId === null && f.type === 'folder');
    const tree = rootFolder ? buildTree(rootFolder._id) : [];

    // Build contents object
    const contents = {};
    files
      .filter((f) => f.type === "file")
      .forEach((file) => {
        contents[file._id.toString()] = file.content || "";
      });

    // Attach files to project response
    const projectWithFiles = {
      ...project.toObject(),
      files: { tree, contents },
    };

    return res.status(200).json({ project: projectWithFiles });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in get project" });
  }
};

// Update a project
exports.UpdateProject = async (req, res) => {
  try {
    const { projectSlug } = req.params;
    const userId = req.userId;
    const updates = req.body;

    const project = await Project.findOneAndUpdate(
      { projectSlug, userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res
      .status(200)
      .json({ message: "Project updated successfully", project });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in update project" });
  }
};

// Delete a project
exports.DeleteProject = async (req, res) => {
  try {
    const { projectSlug } = req.params;
    const userId = req.userId;

    const project = await Project.findOneAndDelete({ projectSlug, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in delete project" });
  }
};

// Update project files
exports.UpdateProjectFiles = async (req, res) => {
  try {
    const { projectSlug } = req.params;
    const userId = req.userId;
    const { tree, contents } = req.body.files;

    const project = await Project.findOne({ projectSlug, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update file contents in Files collection
    for (const [fileId, content] of Object.entries(contents)) {
      if (mongoose.Types.ObjectId.isValid(fileId)) {
        await File.findOneAndUpdate({ _id: fileId }, { content, updatedAt: new Date() });
      }
    }

    // For now, keep the old structure in project.files for backward compatibility
    // TODO: Remove this when frontend is fully migrated
    const projectWithFiles = await Project.findOneAndUpdate(
      { projectSlug, userId },
      { files: { tree, contents }, updatedAt: new Date() },
      { new: true }
    );

    return res
      .status(200)
      .json({
        message: "Project files updated successfully",
        project: projectWithFiles,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error in update project files" });
  }
};

// Create a new file
exports.CreateFile = async (req, res) => {
  try {
    const { projectSlug } = req.params;
    const userId = req.userId;
    const { name, type, parentId, content } = req.body;

    const project = await Project.findOne({ projectSlug, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newFile = new File({
      projectId: project._id,
      parentId,
      name,
      type,
      content: type === "file" ? content || "" : undefined,
    });

    await newFile.save();
    return res
      .status(201)
      .json({ message: "File created successfully", file: newFile });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in create file" });
  }
};

// Get a specific file
exports.GetFile = async (req, res) => {
  try {
    const { projectSlug, fileId } = req.params;
    const userId = req.userId;

    const project = await Project.findOne({ projectSlug, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = await File.findOne({ _id: fileId, projectId: project._id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ file });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in get file" });
  }
};

// Update a file
exports.UpdateFile = async (req, res) => {
  try {
    const { projectSlug, fileId } = req.params;
    const userId = req.userId;
    const updates = req.body;

    const project = await Project.findOne({ projectSlug, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = await File.findOneAndUpdate(
      { _id: fileId, projectId: project._id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ message: "File updated successfully", file });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in update file" });
  }
};

// Delete a file
exports.DeleteFile = async (req, res) => {
  try {
    const { projectSlug, fileId } = req.params;
    const userId = req.userId;

    const project = await Project.findOne({ projectSlug, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = await File.findOneAndDelete({
      _id: fileId,
      projectId: project._id,
    });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error in delete file" });
  }
};
