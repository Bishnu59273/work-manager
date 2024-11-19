"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import { useUser } from "../UserContext";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const { userDetails, setUserDetails } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserDetails(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      setUserDetails(null);
    }
  }, [setUserDetails]);

  return (
    <ProtectedRoute requiredRole={userDetails?.role}>
      {" "}
      <div className="container text-center upper_margin">
        {userDetails?.role === "admin" && (
          <div>
            <h2>Admin Panel</h2>
            <p>Manage users, view reports, and access admin settings.</p>
            {userDetails.image ? (
              <img
                src={userDetails.image}
                alt={`${userDetails.username}'s profile`}
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            ) : (
              <p>No image available</p>
            )}
            <p>Your email: {userDetails.email}</p>
            <p>Your role: {userDetails.role}</p>
          </div>
        )}

        {userDetails?.role === "radiologist" && (
          <div>
            <h2>Radiologist Dashboard</h2>
            <p>View patient records, analyze images, and generate reports.</p>
            {userDetails.image ? (
              <img
                src={userDetails.image}
                alt={`${userDetails.username}'s profile`}
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            ) : (
              <p>No image available</p>
            )}
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
            {userDetails.image ? (
              <img
                src={userDetails.image}
                alt={`${userDetails.username}'s profile`}
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            ) : (
              <p>No image available</p>
            )}
            <p>Your email: {userDetails.email}</p>
            <p>Your role: {userDetails.role}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
