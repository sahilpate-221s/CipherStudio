import React, { useMemo } from "react";
import { SandpackProvider, SandpackPreview as SandpackPreviewComponent, SandpackLayout } from "@codesandbox/sandpack-react";

const SandpackPreview = ({ files }) => {
  const sandpackFiles = useMemo(() => {
    const result = {};

    // Convert our file tree to Sandpack format
    const processFiles = (fileTree, contents) => {
      fileTree.forEach((node) => {
        if (node.type === "file") {
          let sandpackPath = "";

          // Map our file paths to Sandpack expected paths for React template
          if (node.path === "src/app.js") {
            sandpackPath = "/src/App.js";
            result[sandpackPath] = contents[node.id] || "";
          } else if (node.path === "src/main.js") {
            sandpackPath = "/src/index.js";
            // Update import to match App.js
            let content = contents[node.id] || "";
            content = content.replace(/import App from "\.\/app\.js"/, 'import App from "./App"');
            result[sandpackPath] = content;
          } else if (node.path === "src/index.css") {
            sandpackPath = "/src/index.css";
            result[sandpackPath] = contents[node.id] || "";
          } else if (node.path === "public/index.html") {
            sandpackPath = "/index.html";
            result[sandpackPath] = contents[node.id] || "";
          } else if (node.path === "package.json") {
            sandpackPath = "/package.json";
            result[sandpackPath] = contents[node.id] || "";
          } else {
            // For other files, keep them in their relative paths
            sandpackPath = `/${node.path}`;
            result[sandpackPath] = contents[node.id] || "";
          }
        } else if (node.children) {
          processFiles(node.children, contents);
        }
      });
    };

    if (files?.tree && files?.contents) {
      processFiles(files.tree, files.contents);
    }

    return result;
  }, [files]);

  const customSetup = useMemo(() => {
    let dependencies = {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    };

    // Extract dependencies from package.json if available
    if (files?.tree && files?.contents) {
      const packageJsonNode = files.tree.find(node => node.path === "package.json");
      if (packageJsonNode && files.contents[packageJsonNode.id]) {
        try {
          const packageData = JSON.parse(files.contents[packageJsonNode.id]);
          if (packageData.dependencies) {
            dependencies = { ...dependencies, ...packageData.dependencies };
          }
        } catch {
          console.warn("Failed to parse package.json for dependencies");
        }
      }
    }

    return { dependencies };
  }, [files]);

  if (!files?.tree || !files?.contents) {
    return (
      <div className="h-full w-full bg-[#0d0d0d] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-2"></div>
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <SandpackProvider
      files={sandpackFiles}
      template="react"
      theme="dark"
      customSetup={customSetup}
      options={{
        externalResources: [],
        recompileMode: 'immediate'
      }}
    >
      <SandpackLayout style={{ height: '90vh', width: '100%' }}>
        <SandpackPreviewComponent style={{ height: '100%', width: '100%' }} />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export default SandpackPreview;
