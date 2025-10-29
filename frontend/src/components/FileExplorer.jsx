import React from "react";
import FileNode from "./FileNode";

const FileExplorer = ({ tree, selectedId, onSelect, onAction, isRenaming, setIsRenaming, depth = 0 }) => {
  if (!tree) return null;

  return (
    <div className="overflow-y-auto h-full dark:bg-black bg-gray-300 dark:text-white text-gray-900">
      {depth === 0 && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-400 dark:bg-black">
          <h2 className="text-lg h-8 text-center font-semibold">Files</h2>
        </div>
      )}
      <div className="px-2">
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
    </div>
  );
};

export default FileExplorer;
