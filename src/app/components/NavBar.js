"use client";
import Link from "next/link";
// import "../style/styles.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const [username, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo(decoded.username);
      setRole(decoded.role);
    } else {
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setUserInfo(null);
    setRole(null);
    router.push("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" href="/">
          WrokManager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0 w-100">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/contact">
                Contact Us
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0 login">
            <li className="nav-item">
              {role === "admin" && (
                <Link className="btn btn-primary" href="/dashboard">
                  Profile
                </Link>
              )}
            </li>
            <li className="nav-item">
              {role === "radiologist" && (
                <Link className="btn btn-primary" href="/dashboard">
                  Profile
                </Link>
              )}
            </li>
            <li className="nav-item">
              {role === "normal_user" && (
                <Link className="btn btn-primary" href="/dashboard">
                  {username}
                </Link>
              )}
            </li>
            <li className="nav-item">
              {role && (
                <button className="btn btn-danger ms-2" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </li>
            {!role && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
