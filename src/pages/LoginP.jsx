import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUsers } from '../api';
import { GoogleLogin } from '@react-oauth/google';  // Import GoogleLogin

import styles from '../scss/Login.module.scss'

const LoginP = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  // useEffect(() => {
  //   // Wait for the Google login button to be rendered and then change the text
  //   const googleButtonSpan = document.querySelector('[role="button"] span');
  //   if (googleButtonSpan) {
  //     googleButtonSpan.textContent = "Continue with Google"; // Change text after component mounts
  //   }
  // }, []);

  useEffect(() => {
    fetchUsers()
      .then(response => setAllUsers(response.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/chat');
    }
  }, [navigate]);  // Run when navigate is ready

  const handleLogin = () => {
    const foundUser = allUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (foundUser) {
      onLogin(foundUser);
      navigate('/chat');
    } else {
      alert('Invalid credentials!');
    }
  };

  // Google login success handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const userData = JSON.parse(jsonPayload);
      const email = userData.email;  // Use email to check the user
      // Check if the user exists in your mock API data
      const foundUser = allUsers.find((user) => user.username === email);  // or use email as username

      if (foundUser) {
        // If user is found, log them in
        onLogin(foundUser);
        navigate('/chat');
      } else {
        // Handle case where user doesn't exist
        alert("This Google account is not registered. Please register first.");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed! Please try again.");
    }
  };

  return (
    <>
      <div className={styles['login-banner']}>
        <h2>Sign In to your Account</h2>
        <p>Sign in to your Account</p>
      </div>
      <div className={styles['login']}>
        <div className={styles['login-inputs']}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
        </div>
        <button onClick={handleLogin}>Log In</button>
        <div className={styles['or-divider']}>
          <span>OR</span>
        </div>
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin} // on successful login
            onError={() => alert("Google login failed!")}
            clientId="993424580595-ovq1r18nuvl1pj2ctlf7uk68ph0btj4r.apps.googleusercontent.com"
            prompt="select_account"
          />
        </div>
      </div>
      <div className={styles['login-extra-info']}>
        Don't have an account? <NavLink to={'/register'}>Register</NavLink>
      </div>
    </>
  );
};

export default LoginP;
