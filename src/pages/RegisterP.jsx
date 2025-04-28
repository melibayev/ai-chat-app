import React, { useState } from "react";
import { registerUser, checkUsernameExists } from "../api";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google'; 

import styles from '../scss/Register.module.scss';

function RegisterP({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Check if fields are empty
    if (!username.trim() || !password.trim()) {
      alert("Please fill in both username and password.");
      return; 
    }

    // Check if the username already exists
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      alert("Username already exists, please choose another.");
      return;
    }

    setIsLoading(true);
    try {
      const userData = await registerUser({ username, password, messages: [] });
      alert("Registered successfully!");

      localStorage.setItem("user", JSON.stringify(userData.data));
      onLogin(userData.data);

      navigate('/chat', { replace: true }); 
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google login success handler
  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const userData = JSON.parse(jsonPayload);
      const user = {
        username: userData.email,  
        password: "google_login", // Mock password
      };

      const apiResponse = await registerUser(user);
      alert("User registered successfully with Google!");

      localStorage.setItem("user", JSON.stringify(apiResponse.data));

      onLogin(apiResponse.data);

      navigate('/chat', { replace: true });
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed! Please try again.");
    } finally {
      setIsLoading(false); 
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
            disabled={isLoading}  
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}  
          />
        </div>
        <button onClick={handleRegister} disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
        <div className={styles['or-divider']}>
          <span>OR</span>
        </div>
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin} 
            onError={() => alert("Google login failed!")}
            clientId="YOUR_GOOGLE_CLIENT_ID"
            prompt="select_account"
          />
        </div>
      </div>
      <div className={styles['register-extra-info']}>
        Already have an account? <NavLink to={'/login'}>Log In</NavLink>
      </div>
    </>
  );
}

export default RegisterP;
