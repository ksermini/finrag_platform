import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Orb from "../reactbits/orb/Orb";
import { FiArrowRight, FiMail, FiLock, FiUser } from "react-icons/fi";
import "../pages/Login.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "user",
    business_group: "default",
    account_status: "active",
    phone_number: "000-000-0000",
    job_title: "Member",
    department: "Engineering",
    is_admin: false,
    is_active: true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // allow setting secure cookie
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/user");
      } else {
        alert(data.detail || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="login-wrapper">
      <Orb />
      <div className="login-card">
        <h2>Create Account</h2>
        <p>Please fill out your information.</p>
        <form onSubmit={handleRegister}>
          <div className="login-fields">
            <div className="input-with-icon">
              <FiUser />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                required
                value={form.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="input-with-icon">
              <FiUser />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                required
                value={form.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="input-with-icon">
              <FiMail />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-with-icon">
              <FiLock />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="login-submit-button">
            <FiArrowRight />
          </button>
        </form>
        <div className="login-footer">
          <p>
            Already have an account? <Link to="/">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
