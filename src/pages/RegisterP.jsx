import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
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
      <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Register
      </button>
    </div>
  );
}

export default RegisterP;
