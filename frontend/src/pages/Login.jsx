import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Orb from "../reactbits/orb/Orb";
import "./Login.css";
import { FiArrowRight } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      navigate("/user");
    } else {
      alert(data.detail || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <Orb />
      <div className="login-card">
        <h2>Welcome back</h2>
        <p>Please enter your details to sign in.</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            <FiArrowRight />
          </button>
        </form>
        <div className="login-footer">
          <p>
            Don’t have an account? <a href="/register">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
