"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import "@/plugins/custom_css/main.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal_user");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // Convert the image file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            role,
            image: reader.result,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.error);
          throw new Error(errorData.error);
        }

        toast.success("Successfully registered! You can now log in.", {
          className: "toast-message",
        });
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("normal_user");
        setImage(null);
      };
    } catch (error) {
      console.error(error.message);
      toast.error(`Registration failed: please select profile image `, {
        className: "toast-message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container text-center d-flex justify-content-center upper_margin">
      <form onSubmit={handleSubmit} className="w-50">
        <h1 className="mb-3 sign_h1">Sign Up</h1>
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
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label role">
            Profile Image
          </label>
          <div className="col-sm-10">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        </div>
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
              Please wait...
            </>
          ) : (
            "Register"
          )}{" "}
        </button>
      </form>
    </div>
  );
}
