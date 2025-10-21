import React, { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Folder, Plus, Trash2, Edit, Check } from "lucide-react";
import FileExplorer from "./FileExplorer";

const FileNode = ({ node, selectedId, onSelect, onAction, depth, isRenaming, setIsRenaming }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newName, setNewName] = useState(node.name);
  const inputRef = useRef(null);

  const startRename = useCallback((e) => {
    e.stopPropagation();
    setIsRenaming(node.id);
    setNewName(node.name);
  }, [node, setIsRenaming]);

  const saveRename = useCallback((e) => {
    e.stopPropagation();
    if (newName.trim() && newName.trim() !== node.name) {
      onAction("rename", node.id, { newName: newName.trim() });
    }
    setIsRenaming(null);
  }, [node, newName, onAction, setIsRenaming]);

  useEffect(() => {
    if (isRenaming !== node.id) {
      setNewName(node.name);
    }
  }, [node.name, isRenaming, node.id]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") saveRename(e);
    else if (e.key === "Escape") setIsRenaming(null);
  }, [saveRename, setIsRenaming]);

  useEffect(() => {
    if (isRenaming === node.id && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming, node.id]);

  const icon = node.type === "folder"
    ? <Folder size={14} className={`mr-2 ${isOpen ? "text-gray-400" : "text-gray-500"}`} />
    : <FileText size={14} className="mr-2 text-gray-500" />;

  const isSelected = node.id === selectedId;

  return (
    <div className="text-sm font-mono dark:text-gray-300 text-gray-500">
      {isRenaming === node.id ? (
        <div className="flex items-center py-1.5" style={{ paddingLeft: `${depth * 10}px` }}>
          <input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={saveRename}
            onKeyDown={handleKeyPress}
            className="dark:bg-gray-700 dark:text-white px-2 py-0.5 rounded focus:outline-none focus:ring-1 ring-gray-500 w-full"
          />
          <button onClick={saveRename} className="ml-2 text-gray-400"><Check size={16} /></button>
        </div>
      ) : (
        <div
          className={`flex items-center justify-between cursor-pointer py-1.5 px-1 rounded group transition ${
            isSelected ? "bg-gray-800 border-l-2 border-gray-600" : "hover:bg-gray-700/70"
          }`}
          style={{ paddingLeft: `${depth * 10}px` }}
          onClick={() => node.type === "folder" ? setIsOpen(!isOpen) : onSelect(node.id)}
        >
          <span className="flex items-center">{icon}{node.name}</span>
          <div className="flex space-x-1 opacity-100 transition">
            <button onClick={startRename} className="text-gray-400"><Edit size={12} /></button>
            <button
              onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete ${node.name}?`)) onAction("delete", node.id); }}
              className="text-gray-400"
            >
              <Trash2 size={12} />
            </button>
            {node.type === "folder" && (
              <>
                <button onClick={(e) => { e.stopPropagation(); onAction("add", node.id, { nodeType: "file" }); }} className="text-gray-400">
                  <Plus size={12} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onAction("add", node.id, { nodeType: "folder" }); }} className="text-gray-400">
                  <Folder size={12} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {node.type === "folder" && node.children && isOpen && (
        <FileExplorer
          tree={node.children}
          selectedId={selectedId}
          onSelect={onSelect}
          onAction={onAction}
          depth={depth + 1}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      )}
    </div>
  );
};

export default FileNode;
