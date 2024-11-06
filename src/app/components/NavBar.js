"use client";
import Link from "next/link";
import { useUser } from "../UserContext";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserDetails(null); // Update context on logout
    router.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" href="/">
          WorkManager
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
            {userDetails ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm " href="/dashboard">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
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
