"use client"; // Make sure to use this for client-side rendering in Next.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Radiologist = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
  });
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (username && email) {
      setUserInfo({ username, email, role });
    } else {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    router.push("/");
  };
  return (
    <div className="container text-center m-5">
      <h1>Radiology Dashboard</h1>
      <h2>Welcome, {userInfo.username}!</h2>
      <p>Your email: {userInfo.email}</p>
      <p>Your Role: {userInfo.role}</p>
      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Radiologist;
