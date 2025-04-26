import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchUsers } from '../api'; // Assuming you have the function to fetch users

const LoginP = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // Fetch all users
    fetchUsers()
      .then(response => setAllUsers(response.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleLogin = () => {
    const foundUser = allUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (foundUser) {
      onLogin(foundUser);  // Pass the logged-in user to App.js
      navigate('/chat');  // Redirect to /chat after login
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
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
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </div>
  );
};

export default LoginP;
