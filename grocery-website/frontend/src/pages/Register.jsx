import { useState, useRef } from "react";
import { registerUser } from "../api/auth.api.js";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", emailOrMobile: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate("/login");
    } catch {
      formRef.current.classList.add("shake");
      setTimeout(() => formRef.current.classList.remove("shake"), 350);
      alert("Registration failed");
    }
  };

  return (
    <div className="form-box" ref={formRef}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input placeholder=" " value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label>Name</label>
        </div>

        <div className="input-group">
          <input placeholder=" " value={form.emailOrMobile} onChange={(e) => setForm({ ...form, emailOrMobile: e.target.value })} required />
          <label>Email or Mobile</label>
        </div>

        <div className="input-group password-field">
          <input type={showPassword ? "text" : "password"} placeholder=" " value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <label>Password</label>
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button type="submit">Register</button>
      </form>

      <p className="auth-link">
        Already have an account? <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </div>
  );
};

export default Register;
