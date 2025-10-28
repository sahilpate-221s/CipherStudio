import React, { useState } from "react";
import { Folder, File, Plus, FileText, Edit, Trash2 } from "lucide-react";

function FileNode({ node, depth, onSelect, selectedId, onAddFile, onAddFolder, onRename, onDelete, isRenaming, setIsRenaming, toggleFolder }) {
  const padding = { paddingLeft: `${depth * 16}px` };
  const isSelected = selectedId === node.id;
  const [newName, setNewName] = useState(node.name);

  const handleRename = () => {
    if (newName.trim() && newName !== node.name) {
      onRename(node.id, newName.trim());
    }
    setIsRenaming(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setNewName(node.name);
      setIsRenaming(null);
    }
  };

  const handleClick = () => {
    if (node.type === "folder") {
      toggleFolder(node.id);
    } else {
      onSelect(node);
    }
  };

  return (
    <div>
      <div
        style={padding}
        className={`flex items-center justify-between cursor-pointer px-2 py-1 ${
          isSelected ? "bg-gray-600 rounded " : "hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-2 flex-1 text-black dark:text-white">
          {node.type === "folder" ? (
            <Folder size={14} className="text-black dark:text-white" />
          ) : (
            <File size={14} className="text-black dark:text-white" />
          )}
          {isRenaming === node.id ? (
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-1 py-0.5 text-sm flex-1 min-w-0"
              autoFocus
            />
          ) : (
            <span>{node.name}</span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(node.id);
              setNewName(node.name);
            }}
            className="p-1 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            title="Rename"
          >
            <Edit size={12} className="text-black dark:text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="p-1 text-black dark:text-white hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
            title="Delete"
          >
            <Trash2 size={12} className="text-black dark:text-white" />
          </button>
          {node.type === "folder" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddFolder(node.id);
                }}
                className="p-1 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                title="Add Folder"
              >
                <FileText size={12} className="text-black dark:text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddFile(node.id);
                }}
                className="p-1 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                title="Add File"
              >
                <Plus size={12} className="text-black dark:text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      {node.children && node.isOpen &&
        node.children.map((child) => (
          <FileNode
            key={child.id}
            node={child}
            depth={depth + 1}
            onSelect={onSelect}
            selectedId={selectedId}
            onAddFile={onAddFile}
            onAddFolder={onAddFolder}
            onRename={onRename}
            onDelete={onDelete}
            isRenaming={isRenaming}
            setIsRenaming={setIsRenaming}
            toggleFolder={toggleFolder}
          />
        ))}
    </div>
  );
}

export default function FileExplorerPanel({ fileTree, onSelect, onAddFile, onAddFolder, onRename, onDelete, selectedId, isRenaming, setIsRenaming, toggleFolder }) {
  return (
    <div className="overflow-y-auto h-full dark:bg-black bg-gray-300 dark:text-white text-gray-900">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-400 dark:bg-black">
        <h2 className="text-lg  h-8 text-center font-semibold ">Files</h2>
      </div>
      <div className="px-2">
        {fileTree.map((node) => (
          <FileNode key={node.id} node={node} depth={0} onSelect={onSelect} selectedId={selectedId} onAddFile={onAddFile} onAddFolder={onAddFolder} onRename={onRename} onDelete={onDelete} isRenaming={isRenaming} setIsRenaming={setIsRenaming} toggleFolder={toggleFolder} />
        ))}
      </div>
    </div>
  );
}
