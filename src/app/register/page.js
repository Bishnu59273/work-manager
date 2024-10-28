"use client";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response data:", errorData);
        throw new Error(errorData || "Failed to submit the form");
      }

      const result = await response.json();
      setSuccess(`Successfully register with ID: ${result.insertedId}`);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Error during form submission:", err);
      setError(err.message);
    }
  };

  return (
    <>
      <div className="container text-center m-5 d-flex justify-content-center">
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
              />
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
