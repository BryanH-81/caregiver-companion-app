import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register a new user
export const registerUser = async (name, email, password, role = "caregiver") => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Login user
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Logout user
export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};
