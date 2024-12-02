"use client";
import ProtectedRoute from "../components/ProtectedRoute.js";
import { useUser } from "../UserContext.js";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ProfileImage from "../components/profileImage.js";
import UpdateProfileForm from "../components/UpdateProfileForm.js";
import TableSkeleton from "../components/TableSkeleton.js";

export default function Dashboard() {
  const { userDetails, setUserDetails } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [limit] = useState(10); // Number of users per page

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

  // Fetch all users with pagination if the logged-in user is an admin
  useEffect(() => {
    if (userDetails?.role === "admin") {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/users?page=${currentPage}&limit=${limit}`
          );
          if (response.ok) {
            const data = await response.json();
            setUsers(data.users);
            setTotalPages(data.pagination.totalPages); // Update total pages
          } else {
            console.error("Failed to fetch users");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [userDetails, currentPage, limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <ProtectedRoute requiredRole={userDetails?.role}>
      <div className="upper_margin update container">
        <div className="col-lg-2">
          {["admin", "radiologist", "normal_user"].includes(
            userDetails?.role
          ) && <ProfileImage image={userDetails.image} />}
        </div>
        <div className="text-center col-lg-8">
          {userDetails?.role === "admin" && (
            <>
              <h5>Admin Panel</h5>
              <span>Howdy, {userDetails.username}</span>
            </>
          )}
          {userDetails?.role === "radiologist" && (
            <>
              <h5>Radiologist Panel</h5>
              <span>Howdy, {userDetails.username}</span>
            </>
          )}
          {userDetails?.role === "normal_user" && (
            <>
              <h5>User Panel</h5>
              <span>Howdy, {userDetails.username}</span>
            </>
          )}
        </div>
        <div className="col-lg-2 d-flex justify-content-end align-items-start">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog upper_margin">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update Profile
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <UpdateProfileForm />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {userDetails?.role === "admin" && (
          <div className="details">
            <div className="text-center">
              {/* ==== Method 1 for display image using component ====
            <ProfileImage image={userDetails.image} /> */}

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
              <p>Manage users, view reports, and access admin settings.</p>
              {/* Show all users */}
              <h3>All Users</h3>
            </div>
            {loading ? (
              <TableSkeleton />
            ) : (
              <>
                <table className="table text-center border-1">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.uniqueId}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="pagination justify-content-end">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="mx-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {userDetails?.role === "radiologist" && (
          <div className="details">
            <p>View patient records, analyze images, and generate reports.</p>
            <p>Your username: {userDetails.username}</p>
            <p>Your email: {userDetails.email}</p>
            <p>Your role: {userDetails.role}</p>
          </div>
        )}
        {userDetails?.role === "normal_user" && (
          <div className="details">
            <p>
              Access your profile, view your history, and manage your settings.
            </p>
            <p>Your email: {userDetails.email}</p>
            <p>Your username: {userDetails.username}</p>
            <p>Your role: {userDetails.role}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
