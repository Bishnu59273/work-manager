import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../UserContext";

const UpdateProfileForm = () => {
  const { userDetails, setUserDetails } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Fetch token and pre-fill user data when the component mounts
  useEffect(() => {
    if (userDetails) {
      setFormData({
        username: userDetails.username,
        email: userDetails.email,
        image: userDetails.image,
      });
    }
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
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
          image: formData.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "User details updated successfully") {
        toast.success("Profile updated successfully!", {
          className: "toast-message",
        });
        // Update the userDetails in context after successful update
        setUserDetails({
          ...userDetails,
          username: formData.username,
          email: formData.email,
          image: response.data.image || formData.image,
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
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <form onSubmit={handleSubmit}>
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
        {imagePreview && (
          <div className="mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary m-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              {" "}
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>{" "}
              Updating...
            </>
          ) : (
            "Update Profile"
          )}{" "}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
