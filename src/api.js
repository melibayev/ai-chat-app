// src/api.js
import axios from 'axios';

export const API_URL = 'https://680add94d5075a76d9891f59.mockapi.io/users';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
export const GEMINI_API_KEY = 'AIzaSyCJrBODcPP8GH8Pk7ZhiqoXFwkqBfU0P1k';

// Fetch all users
export const fetchUsers = () => axios.get(API_URL);

// Register a new user
export const registerUser = (newUser) => axios.post(API_URL, newUser);

// Update user data
export const updateUser = (id, updatedUser) => axios.put(`${API_URL}/${id}`, updatedUser);

// Generate bot reply using Gemini API
export const generateBotReply = async (msg) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: msg }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text || 'No response.';
    }
    return 'No response.';
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Error generating response.';
  }
};
// src/api.js

// Check if username already exists
export const checkUsernameExists = async (username) => {
  try {
    const response = await axios.get(`${API_URL}?username=${username}`);
    return response.data.length > 0;  // If any user matches the username, it exists
  } catch (error) {
    console.error("Error checking username:", error);
    return false;  // In case of error, assume username does not exist
  }
};
