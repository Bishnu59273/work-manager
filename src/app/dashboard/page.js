"use client";
import ProtectedRoute from "../components/ProtectedRoute"; // Ensure only authenticated users can access
import { useUser } from "../UserContext"; // Import the user context
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const { userDetails, setUserDetails } = useUser(); // Get userDetails from context

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserDetails(decoded); // Update user context with decoded token
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      setUserDetails(null); // No token means no user
    }
  }, [setUserDetails]); // Only run on mount

  return (
    <ProtectedRoute requiredRole={userDetails?.role}>
      {" "}
      {/* Pass role correctly */}
      <div className="container text-center upper_margin">
        {userDetails?.role === "admin" && (
          <div>
            <h2>Admin Panel</h2>
            <p>Manage users, view reports, and access admin settings.</p>
            <p>Your email: {userDetails.email}</p>
            <p>Your role: {userDetails.role}</p>
          </div>
        )}

        {userDetails?.role === "radiologist" && (
          <div>
            <h2>Radiologist Dashboard</h2>
            <p>View patient records, analyze images, and generate reports.</p>
            <p>Your email: {userDetails.email}</p>
            <p>Your role: {userDetails.role}</p>
          </div>
        )}

        {userDetails?.role === "normal_user" && (
          <div>
            <h2>User Dashboard</h2>
            <p>
              Access your profile, view your history, and manage your settings.
            </p>
            <p>Your email: {userDetails.email}</p>
            <p>Your role: {userDetails.role}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
