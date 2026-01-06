import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileDropdown = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="profile-dropdown">
      <div
        onClick={() => {
          navigate("/profile");
          onClose();
        }}
      >
        My Profile
      </div>

      <div
        onClick={() => {
          navigate("/orders");
          onClose();
        }}
      >
        My Orders
      </div>

      <div
        className="danger"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </div>
    </div>
  );
};

export default ProfileDropdown;
