import React from "react";
import Editor from "@monaco-editor/react";

const MonacoEditor = ({ content = "", onChange, theme = "dark" }) => {
  // Map your theme prop to Monaco editor theme names
  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  return (
    <div className={`flex flex-col h-full ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language="javascript"
          theme={editorTheme}
          value={content}
          onChange={onChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true, // adjusts editor automatically
          }}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
