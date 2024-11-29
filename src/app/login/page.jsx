"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal_user");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    } else {
      setIsTokenChecked(true);
    }
  }, [router]);

  if (!isTokenChecked) {
    return (
      <div className="d-flex justify-content-center m-5">
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
        role,
      });

      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        router.push("/dashboard");
        toast.success("Login Successfully", { className: "toast-message" });
      } else {
        toast.error("Login failed", { className: "toast-message" });
        // setError("Login failed: No token returned.");
      }
    } catch (error) {
      console.error("Error logging in:", error.response?.data);
      toast.error(error.response?.data?.error || "Login failed", {
        className: "toast-message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center upper_margin">
      <div className="row">
        <h1 className="login_h1">Login</h1>
        <form className="login_form" onSubmit={handleSubmit}>
          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="inputRole" className="form-label">
              Select Role
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="normal_user">Normal User</option>
              <option value="radiologist">Radiologist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-12 mt-2 text-center">
            <button
              type="submit"
              className="btn btn-primary m-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {" "}
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Login...
                </>
              ) : (
                "Login"
              )}{" "}
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
