"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal_user");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response data:", errorData);
        throw new Error(errorData || "Failed to submit the form");
      }

      const result = await response.json();
      toast.success(`Successfully registered, now you can login`, {
        className: "toast-message",
      });
      // setSuccess(`Successfully register with ID: ${result.insertedId}`);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(error.message);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="container text-center d-flex justify-content-center upper_margin">
        <form onSubmit={handleSubmit} className="w-50">
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
              Username
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Password
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputRole" className="col-sm-2 col-form-label role">
              Select Role
            </label>
            <div className="col-sm-10">
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
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          {error && (
            <p className="mt-2" style={{ color: "red" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="mt-2" style={{ color: "green" }}>
              {success}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
