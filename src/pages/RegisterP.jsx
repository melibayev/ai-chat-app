import React, { useEffect, useState } from "react";
import { registerUser } from "../api";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google'; // import Google Login component

import styles from '../scss/Register.module.scss';

function RegisterP({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Wait for the Google login button to be rendered and then change the text
  //   const googleButtonSpan = document.querySelector('[role="button"] span');
  //   if (googleButtonSpan) {
  //     googleButtonSpan.textContent = "Continue with Google"; // Change text after component mounts
  //   }
  // }, []);

  const handleRegister = async () => {
    setIsLoading(true);  // Set loading state
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
      alert("Registration failed, please try again.");
    } finally {
      setIsLoading(false);  // Set loading state to false
    }
  };

  // Google login success handler
  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);  // Set loading state
    try {
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const userData = JSON.parse(jsonPayload);
      const user = {
        username: userData.email,  // Google username (email)
        password: "google_login", // A mock password, consider generating or handling securely
      };

      // Send the user data to your mock API to create the account
      const apiResponse = await registerUser(user);
      alert("User registered successfully with Google!");

      // Store the user in localStorage
      localStorage.setItem("user", JSON.stringify(apiResponse.data));

      // Call onLogin to update the user state in App.js
      onLogin(apiResponse.data);

      // Navigate to the Chat page after registration
      navigate("/chat");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed! Please try again.");
    } finally {
      setIsLoading(false);  // Set loading state to false
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
            disabled={isLoading}  // Disable input during loading
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}  // Disable input during loading
          />
        </div>
        <button onClick={handleRegister} disabled={isLoading}> {/* Disable button during loading */}
          {isLoading ? "Registering..." : "Register"}
        </button>
        <div className={styles['or-divider']}>
          <span>OR</span>
        </div>
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin} // on successful login
            onError={() => alert("Google login failed!")}
            useOneTap  // Optional: Enables one-tap login for a smoother experience
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
