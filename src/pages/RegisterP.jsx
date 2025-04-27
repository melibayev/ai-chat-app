import React, { useState } from "react";
import { registerUser } from "../api";
import { NavLink, useNavigate } from "react-router-dom";

import styles from '../scss/Register.module.scss'

function RegisterP({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userData = await registerUser({ username, password, messages: [] });
      alert("Registered successfully!");

      // Store the user in localStorage
      localStorage.setItem("user", JSON.stringify(userData.data));

      // Call onLogin to update the user state in App.js
      onLogin(userData.data);

      // Navigate to the Chat page after registration
      navigate("/chat");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <>
    <div className={styles['register-banner']}>
      <h2>Sign Up</h2>
      <p>Create your account</p>
    </div>
    <div className={styles['register']}>
      <div className={styles['register-inputs']}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <button onClick={handleRegister}>
        Register
      </button>
    </div>
    <div className={styles['register-extra-info']}>
      Already have an account? <NavLink to={'/login'}>Log In</NavLink>
    </div>
    </>
  );
}

export default RegisterP;
