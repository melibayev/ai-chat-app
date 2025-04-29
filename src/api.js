// src/api.js
import axios from 'axios';

export const API_URL = 'https://680add94d5075a76d9891f59.mockapi.io/users';

// ai settings
// export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
// export const GEMINI_API_KEY = 'AIzaSyCJrBODcPP8GH8Pk7ZhiqoXFwkqBfU0P1k';

export const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
export const TOGETHER_API_KEY = '50abaf32d1407b7401726e60daa9054f1b012c4044ddd7fdc1f4464dc959885c'; // Store in .env for safety

// Fetch all users
export const fetchUsers = () => axios.get(API_URL);

// Register a new user
export const registerUser = (newUser) => axios.post(API_URL, newUser);

// Update user data
export const updateUser = (id, updatedUser) => axios.put(`${API_URL}/${id}`, updatedUser);

// Generate bot reply using Gemini API
// export const generateBotReply = async (msg) => {
//   try {
//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [{ text: msg }],
//           },
//         ],
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (response.data.candidates && response.data.candidates.length > 0) {
//       return response.data.candidates[0].content.parts[0].text || 'No response.';
//     }
//     return 'No response.';
//   } catch (error) {
//     console.error('Error generating response:', error);
//     return 'Error generating response.';
//   }
// };

export const generateBotReply = async (msg) => {
  try {
    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: 'meta-llama/Llama-4-Scout-17B-16E-Instruct', // You can change to another model if needed
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: msg }
        ],
        temperature: 0.7,
        max_tokens: 512
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        },
      }
    );

    return response.data.choices?.[0]?.message?.content || 'No response.';
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
