import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser, isAuthenticated, logoutUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const loggedInUser = getCurrentUser();
        if (loggedInUser) {
            setUser(loggedInUser);
            setAuthenticated(true);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setAuthenticated(true);
    };

    const logout = () => {
        logoutUser();
        setUser(null);
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
