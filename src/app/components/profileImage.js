const ProfileImage = ({ image, username }) => (
  <img
    src={image || "/default_user.jpg"}
    alt={`${username}'s profile`}
    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
  />
);
export default ProfileImage;
