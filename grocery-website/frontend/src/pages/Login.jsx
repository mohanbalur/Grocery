import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/auth.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css";

const Login = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ emailOrMobile, password });
      login(res.data);
      navigate(res.data.role === "admin" ? "/admin/dashboard" : from, { replace: true });
    } catch {
      formRef.current.classList.add("shake");
      setTimeout(() => formRef.current.classList.remove("shake"), 350);
      alert("Login failed");
    }
  };

  return (
    <div className="form-box" ref={formRef}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input placeholder=" " value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} required />
          <label>Email or Mobile</label>
        </div>

        <div className="input-group password-field">
          <input type={showPassword ? "text" : "password"} placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Password</label>
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <div className="forgot-row">
          <span onClick={() => navigate("/forgot-password")}>Forgot password?</span>
        </div>

        <button type="submit">Login</button>
      </form>

      <p className="auth-link">
        Don’t have an account? <span onClick={() => navigate("/register")}>Register</span>
      </p>
    </div>
  );
};

export default Login;
