"use client"; // Make sure to use this for client-side rendering in Next.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (username && email) {
      setUserInfo({ username, email });
    } else {
      router.push("/"); // Redirect to index page if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    router.push("/"); // Redirect to index page
  };

  return (
    <div className="container text-center m-5">
      <h1>Dashboard</h1>
      <h2>Welcome, {userInfo.username}!</h2>
      <p>Your email: {userInfo.email}</p>
      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
