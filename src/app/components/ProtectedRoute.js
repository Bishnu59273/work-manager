"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, requiredRole }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(null); // null means loading state

  // Function to get and decode token
  const getTokenDetails = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null; // Return null for invalid token
    }
  };

  useEffect(() => {
    const decoded = getTokenDetails();

    // If no token or invalid token, redirect to login
    if (!decoded) {
      setAuthorized(false);
      router.replace("/login");
      return; // Exit early
    }

    // Check role authorization
    if (!requiredRole || decoded.role === requiredRole) {
      setAuthorized(true); // Authorized if role matches or no specific role required
    } else {
      setAuthorized(false);
      router.replace("/login"); // Redirect if role does not match
    }
  }, [requiredRole, router]);

  // Show loading state while checking authorization
  if (authorized === null) {
    return (
      <div className="container text-center m-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  // Render children if authorized, otherwise null (redirect will occur)
  return authorized ? children : null;
}
