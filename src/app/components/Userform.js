"use client";
import { useState } from "react";

const UserForm = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, message }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response data:", errorData);
        throw new Error(errorData || "Failed to submit the form");
      }

      const result = await response.json();
      setSuccess(`Message Sent`);
      setName("");
      setMessage("");
    } catch (err) {
      console.error("Error during message submission:", err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-success" type="submit">
        Submit
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default UserForm;
