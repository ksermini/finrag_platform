import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Still reusing the glassy styles

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
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
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Account created! Please log in.");
        navigate("/");
      } else {
        alert(data.detail || "Registration failed.");
      }
    } catch (err) {
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h2>Create Account</h2>
        <p>Please fill out your information.</p>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            required
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            required
            value={form.last_name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit">→</button>
        </form>
        <div className="login-footer">
          <p>
            Already have an account? <a href="/">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
