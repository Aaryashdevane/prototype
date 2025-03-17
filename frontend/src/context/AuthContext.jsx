import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Hook to use context easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🟢 1. Load user from localStorage on mount
  useEffect(() => {
    const legacyPersist = localStorage.getItem("persist:root");
    if (legacyPersist) {
      localStorage.removeItem("persist:root"); // Remove Redux-Persist leftover
    }
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
   useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // 🟢 2. Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // 🟢 3. Login function
  const login = (email, role) => {
    const userData = { email, role };
    setUser(userData);
  };

  // 🟢 4. Logout function (optional)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
