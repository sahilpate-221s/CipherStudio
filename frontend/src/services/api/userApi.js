const BaseUrl = "https://cipherstudio-25m8.onrender.com/api/users"; // match your backend port

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BaseUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register user");
    }

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${BaseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to login user");
    }

    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await fetch(`${BaseUrl}/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // include cookies
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user profile");
    }
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${BaseUrl}/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to logout user");
    }
    return true;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

export const updateUserSettings = async (settings) => {
  try {
    const response = await fetch(`${BaseUrl}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update user settings");
    }
    return data;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};
