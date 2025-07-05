/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./Login.css";

function Login() {
  // State to hold input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const text = await response.text();
        setMessage(text);
      } else {
        setMessage("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <i className="bx bx-user"></i>
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className="bx bx-lock"></i>
        </div>

        <div className="remember-forget">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit" className="btn">
          Login
        </button>

        <p style={{ color: "red", marginTop: "10px" }}>{message}</p>

        <div className="register-link">
          <p>
            Don't have an account? <a href="#">Register now</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
