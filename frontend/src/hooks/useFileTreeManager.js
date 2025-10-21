import { useState, useCallback } from "react";

const generateId = () => Math.random().toString(36).substring(2, 9);

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

const processTree = (tree, action, targetId, data = {}, parentPath = "") => {
  return tree
    .map((node) => {
      const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

      // Recurse first if folder
      if (node.type === "folder" && node.children) {
        const updatedChildren = processTree(node.children, action, targetId, data, currentPath);

        // Add new node inside this folder
        if (action === "add" && node.id === targetId) {
          const newNode = {
            id: generateId(),
            name: data.nodeType === "file" ? "new-file.js" : "new-folder",
            type: data.nodeType,
            path: `${currentPath}/${data.nodeType === "file" ? "new-file.js" : "new-folder"}`,
            content: data.nodeType === "file" ? "" : undefined,
            children: data.nodeType === "folder" ? [] : undefined,
          };
          data.newId = newNode.id;
          return { ...node, children: sortTree([...updatedChildren, newNode]) };
        }

        return { ...node, children: updatedChildren };
      }

      // Handle rename / delete
      if (node.id === targetId) {
        if (action === "delete") return null;
        if (action === "rename") {
          return {
            ...node,
            name: data.newName,
            path: `${parentPath}/${data.newName}`,
          };
        }
      }

      return node;
    })
    .filter(Boolean);
};

export const useFileTreeManager = (initialTree, initialContents, initialSelectedId) => {
  const [fileTree, setFileTree] = useState(sortTree(initialTree));
  const [selectedFileId, setSelectedFileId] = useState(initialSelectedId);
  const [isRenaming, setIsRenaming] = useState(null);
  const [fileContents, setFileContents] = useState(initialContents);

  const handleSelectFile = useCallback((id) => setSelectedFileId(id), []);

  const handleFileAction = useCallback(
    (action, targetId, data = {}) => {
      const updatedTree = sortTree(processTree(fileTree, action, targetId, data));

      if (action === "add" && data.newId) {
        setIsRenaming(data.newId);
        if (data.nodeType === "file") setSelectedFileId(data.newId);
      } else if (action === "delete" && targetId === selectedFileId) {
        setSelectedFileId(null);
      }

      setFileTree(updatedTree);
    },
    [fileTree, selectedFileId]
  );

  const handleUpdateContent = useCallback((id, newContent) => {
    setFileContents((prev) => ({ ...prev, [id]: newContent }));
  }, []);

  return {
    fileTree,
    selectedFileId,
    isRenaming,
    setIsRenaming,
    handleSelectFile,
    handleFileAction,
    handleUpdateContent,
    fileContents,
    setFileTree,
    setFileContents,
  };
};
