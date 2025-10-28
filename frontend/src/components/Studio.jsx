import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Home, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FileExplorerPanel from "./FileExplorerPanel";
import SandpackPreview from "./SandpackPreview";

import MonacoEditor from "../editor/MonacoEditor";
import { useFileTreeManager } from "../hooks/useFileTreeManager";
import { getProject, updateProjectFiles } from "../services/api/projectApi";

// Error Boundary Component for SandpackPreview
class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Preview Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-slate-950/30 text-slate-400">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-2"></div>
            <p className="text-sm">Compiling...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initial project structure
const initialTree = [
  {
    id: "1",
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        id: "2",
        name: "app.js",
        type: "file",
        path: "src/app.js",
      },
      {
        id: "3",
        name: "index.css",
        type: "file",
        path: "src/index.css",
      },
      {
        id: "4",
        name: "main.js",
        type: "file",
        path: "src/main.js",
      },
    ],
  },
  {
    id: "5",
    name: "public",
    type: "folder",
    path: "public",
    children: [
      {
        id: "6",
        name: "index.html",
        type: "file",
        path: "public/index.html",
      },
    ],
  },
  {
    id: "7",
    name: "package.json",
    type: "file",
    path: "package.json",
  },
];

// Initial contents
const initialContents = {
  2: `
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
  3: `
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
  4: `
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
  6: `
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
  </body>
</html>
`.trim(),
  7: JSON.stringify(
    {
      name: "cipher-studio-app",
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
};

export default function Studio() {
  const navigate = useNavigate();
  const { projectSlug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoSave, setAutoSave] = useState(() => {
    const saved = localStorage.getItem("autoSave");
    return saved === "true";
  });

  const [activeFile, setActiveFile] = useState("/src/app.js");
  const [openTabs, setOpenTabs] = useState([
    { path: "/src/app.js", name: "app.js", id: "2" },
  ]);
  const [previewKey, setPreviewKey] = useState(0);
  const previewDebounceRef = useRef(null);
  const saveDebounceRef = useRef(null);

  // Local file tree for UI interactions
  const {
    fileTree: localFileTree,
    selectedFileId: localSelectedFileId,
    isRenaming: localIsRenaming,
    setIsRenaming: setLocalIsRenaming,
    handleSelectFile: localHandleSelectFile,
    handleUpdateContent: localHandleUpdateContent,
    fileContents: localFileContents,
    handleFileAction: localHandleFileAction,
    setFileTree: setLocalFileTree,
    setFileContents: setLocalFileContents,
    toggleFolder: localToggleFolder,
  } = useFileTreeManager(initialTree, initialContents, "2");

  // Server file tree for saving (avoid circular sync)
  const [serverFileTree, setServerFileTree] = useState([]);
  const [serverFileContents, setServerFileContents] = useState({});

  // Update preview when file tree changes (e.g., new files added)
  useEffect(() => {
    setPreviewKey(prev => prev + 1);
  }, [localFileTree]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProject(projectSlug);
        setProject(response.project);
        if (response.project.files) {
          // Convert file IDs from strings to match the expected format
          const tree = response.project.files.tree || [];
          const contents = response.project.files.contents || {};

          // Ensure all IDs are strings and paths are correct
          const normalizeTree = (nodes) => {
            return nodes.map((node) => ({
              ...node,
              id: node.id.toString(),
              path: node.path || node.name,
              children: node.children
                ? normalizeTree(node.children)
                : undefined,
            }));
          };

          const sortTree = (nodes) => {
            return nodes
              .sort((a, b) => {
                if (a.type === "folder" && b.type === "file") return -1;
                if (a.type === "file" && b.type === "folder") return 1;
                return a.name.localeCompare(b.name);
              })
              .map((node) => ({
                ...node,
                children: node.children ? sortTree(node.children) : undefined,
              }));
          };

          const normalizedTree = sortTree(normalizeTree(tree));
          setServerFileTree(normalizedTree);
          setServerFileContents(contents);
          setLocalFileTree(normalizedTree);
          setLocalFileContents(contents);

          // Set active file to app.js if it exists, otherwise the first file in the tree
          const findAppJs = (nodes) => {
            for (const node of nodes) {
              if (node.type === "file" && node.name === "app.js") return node;
              if (node.children) {
                const found = findAppJs(node.children);
                if (found) return found;
              }
            }
            return null;
          };

          const findFirstFile = (nodes) => {
            for (const node of nodes) {
              if (node.type === "file") return node;
              if (node.children) {
                const found = findFirstFile(node.children);
                if (found) return found;
              }
            }
            return null;
          };

          const appJsFile = findAppJs(normalizedTree);
          const firstFile = appJsFile || findFirstFile(normalizedTree);
          if (firstFile) {
            setActiveFile(`/${firstFile.path}`);
            setOpenTabs([
              {
                path: `/${firstFile.path}`,
                name: firstFile.name,
                id: firstFile.id,
              },
            ]);
            localHandleSelectFile(firstFile.id);
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    if (projectSlug) {
      fetchProject();
    }
  }, [projectSlug, localHandleSelectFile]);

  const saveFiles = useCallback(async () => {
    if (!projectSlug) return;
    try {
      await updateProjectFiles(projectSlug, {
        tree: localFileTree,
        contents: localFileContents,
      });
    } catch (error) {
      console.error("Error saving files:", error);
    }
  }, [projectSlug, localFileTree, localFileContents]);

  const saveFilesRef = useRef(saveFiles);

  useEffect(() => {
    saveFilesRef.current = saveFiles;
  }, [saveFiles]);

  useEffect(() => {
    if (!autoSave) return;
    const interval = setInterval(() => {
      saveFilesRef.current();
    }, 1000); // Auto-save every 1 sec
    return () => clearInterval(interval);
  }, [autoSave]);

  const findFileById = (tree, id) => {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFileById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const path = `/${file.path}`;
    setActiveFile(path);
    localHandleSelectFile(file.id);

    // Always ensure editor content matches this file
    setOpenTabs((prev) => {
      const exists = prev.some((tab) => tab.path === path);
      if (!exists) {
        return [...prev, { path, name: file.name, id: file.id }];
      }
      return prev;
    });
  };

  const handleTabClick = (path) => setActiveFile(path);
  const handleTabClose = (path) => {
    setOpenTabs((prev) => prev.filter((tab) => tab.path !== path));
    if (activeFile === path) {
      const remainingTabs = openTabs.filter((tab) => tab.path !== path);
      setActiveFile(remainingTabs.length > 0 ? remainingTabs[0].path : null);
    }
  };

  const selectedFile = findFileById(localFileTree, localSelectedFileId);

  if (loading) {
    return (
      <div className="h-screen w-screen dark:bg-[#0a0a0a]  dark:text-white text-gray-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen dark:bg-[#0a0a0a]  dark:text-white text-gray-600 font-inter overflow-hidden flex flex-col">
      {/* Top bar */}
      <div className="h-12 dark:bg-black bg-gray-300 border-b border-gray-800 flex items-center px-4 justify-between">
        <span className="font-medium dark:text-white text-black">
          {project?.projectName || "Code Studio"}
        </span>
        <div className="flex items-center gap-2">
          <label className="flex items-center space-x-2 dark:text-white text-black px-3 py-1 rounded border border-gray-700 dark:hover:bg-gray-700 hover:bg-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => {
                const newValue = e.target.checked;
                setAutoSave(newValue);
                localStorage.setItem("autoSave", newValue.toString());
              }}
              className="w-4 h-4 text-cyan-500 dark:bg-gray-800 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-sm">Auto Save</span>
          </label>
          <button
            onClick={saveFiles}
            className="flex items-center space-x-2 dark:text-white text-black px-3 py-1 rounded border border-gray-700 dark:hover:bg-gray-700 hover:bg-gray-500 cursor-pointer"
            aria-label="Save Files"
          >
            <Save size={16} />
            <span className="text-sm">Save</span>
          </button>
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center space-x-2 dark:text-white text-black px-3 py-1 rounded border border-gray-700 dark:hover:bg-gray-700 hover:bg-gray-500 cursor-pointer"
            aria-label="Back to Home"
          >
            <Home size={16} />
            <span className="text-sm">Home</span>
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 overflow-hidden flex" style={{ height: "80vh" }}>
        {/* File Explorer Panel */}
        <div className="w-1/5 dark:bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-sm border-r border-slate-700/50 flex flex-col overflow-hidden shadow-xl">
          <div className="flex-1 overflow-y-auto dark:bg-slate-950/50 bg-slate-500">
            <FileExplorerPanel
              onSelect={handleFileSelect}
              onAddFile={(folderId) => {
                localHandleFileAction("add", folderId, { nodeType: "file" });
                saveFiles();
              }}
              onAddFolder={(folderId) => {
                localHandleFileAction("add", folderId, { nodeType: "folder" });
                saveFiles();
              }}
              onRename={(nodeId, newName) => {
                localHandleFileAction("rename", nodeId, { newName });
                saveFiles();
              }}
              onDelete={(nodeId) => {
                localHandleFileAction("delete", nodeId);
                saveFiles();
              }}
              fileTree={localFileTree}
              selectedId={localSelectedFileId}
              isRenaming={localIsRenaming}
              setIsRenaming={setLocalIsRenaming}
              toggleFolder={localToggleFolder}
            />
          </div>
        </div>

        {/* Editor Panel */}
        <div className="w-1/2 dark:bg-black bg-gray-300 backdrop-blur-sm border-r border-slate-700/50 flex flex-col overflow-hidden shadow-xl">
          {/* Tabs */}
          <div className="h-12 dark:bg-black bg-gray-400 border-b border-slate-700/50 flex items-center px-4">
            <div className="flex overflow-x-auto space-x-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 ml-4">
              {openTabs.map((tab) => (
                <div
                  key={tab.path}
                  className={`flex items-center px-4 py-2 rounded-t-lg cursor-pointer transition-all duration-300 ${
                    activeFile === tab.path
                      ? "dark:bg-slate-950/80 bg-gray-500 dark:text-white text-black border-t-2 border-black shadow-lg"
                      : "dark:bg-slate-800/50 bg-gray-500 dark:text-slate-400 hover:bg-slate-700/70 hover:text-white"
                  }`}
                  onClick={() => handleTabClick(tab.path)}
                >
                  <span className="text-sm font-medium">{tab.name}</span>
                  <button
                    className="ml-3 p-1 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabClose(tab.path);
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden dark:bg-black bg-gray-300">
            <MonacoEditor
              content={localFileContents[localSelectedFileId] || ""}
              onChange={(newContent) => {
                if (selectedFile) {
                  localHandleUpdateContent(selectedFile.id, newContent);
                  setServerFileContents((prev) => ({
                    ...prev,
                    [selectedFile.id]: newContent,
                  }));

                  // Auto-save on change if enabled
                  if (autoSave) {
                    if (saveDebounceRef.current) {
                      clearTimeout(saveDebounceRef.current);
                    }
                    saveDebounceRef.current = setTimeout(() => {
                      saveFilesRef.current();
                    }, 1000); // Auto-save 1 second after stopping typing
                  }

                  // Debounce preview updates to avoid excessive re-renders and errors during typing
                  if (previewDebounceRef.current) {
                    clearTimeout(previewDebounceRef.current);
                  }
                  previewDebounceRef.current = setTimeout(() => {
                    setPreviewKey(prev => prev + 1);
                  }, 500); // Reduced from 2000ms to 500ms for better responsiveness
                }
              }}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-3/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-sm flex flex-col overflow-hidden shadow-xl">
          <div className="h-12 bg-gray-400 dark:bg-black border-b border-slate-700/50 flex items-center px-4">
            <h3 className="text-sm font-semibold dark:text-white text-black">Preview</h3>
          </div>
          <div className="flex-1 overflow-hidden bg-slate-950/30">
            <PreviewErrorBoundary>
              <SandpackPreview
                key={previewKey}
                files={{ tree: localFileTree, contents: localFileContents }}
              />
            </PreviewErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
