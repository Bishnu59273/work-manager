"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute"; // Ensure only authenticated users can access
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [role, setRole] = useState("");

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
  });

  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      setUserInfo({ username, email, role });
    } else {
      router.push("/");
    }
  }, [router]);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("username");
  //   localStorage.removeItem("email");
  //   localStorage.removeItem("role");
  //   router.push("/");
  // };

  return (
    <ProtectedRoute>
      <div className="container text-center m-5">
        <h1>User Dashboard</h1>
        {role === "admin" && (
          <div>
            <h2>Admin Panel</h2>
            <p>Manage users, view reports, and access admin settings.</p>
            <p>Your email: {userInfo.email}</p>
            <p>Your role: {userInfo.role}</p>

            {/* Additional admin components */}
          </div>
        )}
        {role === "radiologist" && (
          <div>
            <h2>Radiologist Dashboard</h2>
            <p>View patient records, analyze images, and generate reports.</p>
            <p>Your email: {userInfo.email}</p>
            <p>Your role: {userInfo.role}</p>

            {/* Additional radiologist components */}
          </div>
        )}
        {role === "normal_user" && (
          <div>
            <h2>User Dashboard</h2>
            <p>
              Access your profile, view your history, and manage your settings.
            </p>
            <p>Your email: {userInfo.email}</p>
            <p>Your role: {userInfo.role}</p>

            {/* Additional user components */}
          </div>
        )}
        {!role && <p>Loading role information...</p>}
      </div>
    </ProtectedRoute>
  );
}
