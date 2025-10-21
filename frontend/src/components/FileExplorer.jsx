import React from "react";
import FileNode from "./FileNode";

const FileExplorer = ({ tree, selectedId, onSelect, onAction, depth = 0, isRenaming, setIsRenaming }) => {
  if (!tree) return null;

  return (
    <div className={`pl-2 ${depth > 0 ? "border-l border-gray-800/50" : ""}`}>
      {tree.map((node) => (
        <FileNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
          onAction={onAction}
          depth={depth}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      ))}
    </div>
  );
};

export default FileExplorer;
