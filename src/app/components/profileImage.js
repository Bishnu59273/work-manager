const ProfileImage = ({ image, username }) => (
  <img
    src={image || "/default_user.jpg"}
    alt={`${username}'s profile`}
    style={{ width: "150px", height: "150px", borderRadius: "50%" }}
  />
);
export default ProfileImage;
