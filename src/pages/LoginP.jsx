import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUsers } from '../api';

import styles from '../scss/Login.module.scss'

const LoginP = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers()
      .then(response => setAllUsers(response.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  useEffect(() => {
    // check if user already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/chat');
    }
  }, [navigate]);  // run when navigate is ready

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
    </div>
    <div className={styles['login-extra-info']}>
      Don't have an account? <NavLink to={'/register'}>Register</NavLink>
    </div>
    </>
  );
};

export default LoginP;
