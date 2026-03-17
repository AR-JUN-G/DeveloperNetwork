import React, { useState } from "react";
import { motion } from "motion/react";
import "./Login.css";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../utils/constants";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../../Store/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId: email,
          password: password,
        }),
      });

      const data = await response.json();
      dispatch(updateUserDetails(data));
      if (!response.ok) {
        throw new Error(
          data.message || "Invalid credentials! Please try again.",
        );
      }

      console.log("Login Successful:", data);

      navigate("/home"); // Navigate to home or dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-header">
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="form-input"
            />
            <button
              type="button"
              className="eye-icon-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="login-button"
        >
          Login
        </motion.button>
      </form>
    </div>
  );
};

export default Login;
