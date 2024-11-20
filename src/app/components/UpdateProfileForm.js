import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UpdateProfileForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: "",
  });

  const [token, setToken] = useState(null);

  // Fetch token and pre-fill user data when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);

      const decodedToken = jwtDecode(storedToken);
      const userEmail = decodedToken.email;

      // Fetch user details for pre-filling the form
      axios
        .get(`/api/users?email=${userEmail}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          const user = response.data.user;
          setFormData({
            username: user.username || "",
            email: user.email || "",
            image: user.image || "",
          });
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.put("/api/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Response data:", response.data);
      if (response.data.message === "User details updated successfully") {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        alert(error.response.data.error || "Failed to update profile.");
      } else if (error.request) {
        console.error("Request error:", error.request);
        alert("No response from server.");
      } else {
        console.error("General error:", error.message);
        alert("An error occurred while updating your profile.");
      }
    }
  };

  return (
    <div className="container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Profile Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
