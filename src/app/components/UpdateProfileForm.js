import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const UpdateProfileForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: "", // Store image as base64 string here
  });

  const [token, setToken] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0]; // Get the selected image file
    setSelectedImage(imageFile);

    // Convert image to base64
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result, // Save the base64 string to formData
      }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("No token found. Please log in.", {
        className: "toast-message",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(
        "/api/users",
        {
          username: formData.username,
          email: formData.email,
          image: formData.image, // Send the base64 image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("respons form", response);

      if (response.data.message === "User details updated successfully") {
        toast.success("Profile updated successfully!", {
          className: "toast-message",
        });
      } else {
        toast.error("Failed to update profile.", {
          className: "toast-message",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Image size is big, Maximum size is 10MB", {
        className: "toast-message",
      });
    } finally {
      // Reset loading state after request is completed
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <form onSubmit={handleSubmit} className="w-50">
        <h2>Update Profile</h2>
        <div className="form-group">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              disabled
            />
          </div>
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
          <label htmlFor="image">Profile Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="form-control"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary m-3"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Updating..." : "Update Profile"}{" "}
          {/* Show loading text */}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
