"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, requiredRole }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(null); // null for loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (!requiredRole || decoded.role === requiredRole) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.push("/login"); // Redirect if role does not match
      }
    } else {
      setAuthorized(false);
      router.push("/login"); // Redirect if no token
    }
  }, [requiredRole, router]);

  if (authorized === null) {
    // You might want to show a loading state here
    return <div className="container text-center m-5">Loading...</div>; // or null to render nothing
  }

  return authorized ? children : null; // Render children if authorized
}
