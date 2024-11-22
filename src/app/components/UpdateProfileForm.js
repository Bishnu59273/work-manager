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

    if (!imageFile) {
      toast.error("Please select a valid image file.", {
        className: "toast-message",
      });
      return;
    }

    // Validate file type
    if (!imageFile.type.startsWith("image/")) {
      toast.error("Only image files are allowed.", {
        className: "toast-message",
      });
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      toast.error("Image size exceeds 10MB. Please select a smaller file.", {
        className: "toast-message",
      });
      return;
    }

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex text-center">
      <form onSubmit={handleSubmit} className="pt-0">
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
              onError={(e) => {
                toast.info(
                  "This image not supported in preview.Choose another image",
                  {
                    className: "toast-message",
                  }
                );
                e.target.src = "/default_user.jpg";
              }}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                display: "block",
                marginTop: "10px",
              }}
            >
              Preview
            </span>
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
                className="spinner-border spinner-border-sm"
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
