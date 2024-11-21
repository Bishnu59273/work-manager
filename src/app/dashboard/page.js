"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import { useUser } from "../UserContext";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ProfileImage from "../components/profileImage.js";
import UpdateProfileForm from "../components/UpdateProfileForm";

export default function Dashboard() {
  const { userDetails, setUserDetails } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserDetails(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      setUserDetails(null);
    }
  }, [setUserDetails]);

  return (
    <ProtectedRoute requiredRole={userDetails?.role}>
      {" "}
      <div className="container text-center upper_margin">
        {userDetails?.role === "admin" && (
          <div>
            <h2>Admin Panel</h2>
            <p>Manage users, view reports, and access admin settings.</p>
            {/* ==== Method 1 for display image by using component ==== */}
            <ProfileImage
              image={userDetails.image}
              username={userDetails.username}
            />

            {/* ==== Method 2 for display image ===== */}
            {/* {userDetails.image ? (
              <img
                src={userDetails.image}
                alt={`${userDetails.username}'s profile`}
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            ) : (
              <img
                src=""
                alt={`${userDetails.username}'s profile`}
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            )} */}
            <p>Your email: {userDetails.email}</p>
            <p>Your role: {userDetails.role}</p>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Update
            </button>

            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog upper_margin">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Update Profile
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <UpdateProfileForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {userDetails?.role === "radiologist" && (
          <div>
            <h2>Radiologist Dashboard</h2>
            <p>View patient records, analyze images, and generate reports.</p>
            <ProfileImage
              image={userDetails.image}
              username={userDetails.username}
            />
            <p>Your email: {userDetails.email}</p>
            <p>Your role: {userDetails.role}</p>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Update
            </button>

            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog upper_margin">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Update Profile
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <UpdateProfileForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {userDetails?.role === "normal_user" && (
          <div>
            <h2>User Dashboard</h2>
            <p>
              Access your profile, view your history, and manage your settings.
            </p>
            <ProfileImage
              image={userDetails.image}
              username={userDetails.username}
            />
            <p>Your email: {userDetails.email}</p>
            <p>Your username: {userDetails.username}</p>
            <p>Your role: {userDetails.role}</p>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Update
            </button>

            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog upper_margin">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Update Profile
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <UpdateProfileForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
