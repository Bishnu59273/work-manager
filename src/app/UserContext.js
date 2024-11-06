// UserContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  const loadUserDetails = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserDetails(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUserDetails(null); // If there's an error, set to null
      }
    } else {
      setUserDetails(null); // No token means no user
    }
  };

  // Run once on mount to load user details
  useEffect(() => {
    loadUserDetails();

    // Listen for storage changes (to handle logout in other tabs)
    const handleStorageChange = () => loadUserDetails();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);
