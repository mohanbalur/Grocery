import { useState } from "react";
import { forgotPassword } from "../api/auth.api.js";
import "./Auth.css";

const ForgotPassword = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ emailOrMobile });
      setMessage("Password reset link sent");
    } catch {
      setMessage("User not found");
    }
  };

  return (
    <div className="form-box">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input placeholder=" " value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} required />
          <label>Email or Mobile</label>
        </div>

        <button type="submit">Send Reset Link</button>
      </form>

      {message && <p className="info-text">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
