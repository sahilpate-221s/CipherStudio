const BaseUrl = "https://cipherstudio-25m8.onrender.com/api/projects"; // match your backend port
// const BaseUrl = "https://cipherstudio-25m8.onrender.com/api/projects"; // match your backend port

export const getUserProjects = async () => {
  try {
    const response = await fetch(`${BaseUrl}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch projects");
    }

    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await fetch(`${BaseUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
      credentials: "include", // include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create project");
    }

    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProject = async (projectSlug) => {
  try {
    const response = await fetch(`${BaseUrl}/${projectSlug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch project");
    }

    return data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const updateProject = async (projectSlug, updateData) => {
  try {
    const response = await fetch(`${BaseUrl}/${projectSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
      credentials: "include", // include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update project");
    }

    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectSlug) => {
  try {
    const response = await fetch(`${BaseUrl}/${projectSlug}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // include cookies
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete project");
    }

    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const updateProjectFiles = async (projectSlug, files) => {
  try {
    const response = await fetch(`${BaseUrl}/${projectSlug}/files`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files }),
      credentials: "include", // include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update project files");
    }

    return data;
  } catch (error) {
    console.error("Error updating project files:", error);
    throw error;
  }
};

// File CRUD operations
export const createFile = async (projectSlug, fileData) => {
  try {
    const response = await fetch(`${BaseUrl}/${projectSlug}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fileData),
      credentials: "include", // include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create file");
    }

    return data;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const getFile = async (projectSlug, fileId) => {
  try {
    const response = await fetch(`${BaseUrl}/${projectSlug}/files/${fileId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch file");
    }

    return data;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

export const updateFile = async (projectSlug, fileId, updateData) => {
  try {
    const response = await fetch(`${BaseUrl}/${projectSlug}/files/${fileId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
      credentials: "include", // include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update file");
    }

    return data;
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
};

export const deleteFile = async (projectSlug, fileId) => {
  try {
    const response = await fetch(`${BaseUrl}/${projectSlug}/files/${fileId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // include cookies
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete file");
    }

    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
