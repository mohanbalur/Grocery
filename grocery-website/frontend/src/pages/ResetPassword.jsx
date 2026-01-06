import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth.api.js";
import "./Auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(token, { password });
      alert("Password reset successful");
      navigate("/login");
    } catch {
      alert("Invalid or expired link");
    }
  };

  return (
    <div className="form-box">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>New Password</label>
        </div>

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
