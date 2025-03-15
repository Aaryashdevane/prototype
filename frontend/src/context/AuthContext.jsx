    import React, { createContext, useState, useContext, useEffect } from "react";

    const AuthContext = createContext();

    export const useAuth = () => useContext(AuthContext);

    export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Simulated login function
    const login = (email, role) => {
        const userData = { email, role };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // Check if user is logged in on page load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) setUser(storedUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login }}>
        {children}
        </AuthContext.Provider>
    );
    };
