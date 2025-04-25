import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://680add94d5075a76d9891f59.mockapi.io/users'; // Replace with your MockAPI URL
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyCJrBODcPP8GH8Pk7ZhiqoXFwkqBfU0P1k';

const HomeP = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  // Load all users from MockAPI
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setAllUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setLoading(false);
      });
  }, []);

  const updateMockAPI = async (users) => {
    // Updating the users' data in MockAPI
    await axios.put(API_URL, users, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const handleRegister = () => {
    const existing = allUsers.find((u) => u.username === username);
    if (existing) {
      alert('User already exists!');
      return;
    }

    const newUser = { username, password, messages: [] };
    axios
      .post(API_URL, newUser)
      .then((response) => {
        setIsRegistered(true);
        setUserData(response.data);
        setMessages([]);
      })
      .catch((err) => console.error('Error registering user:', err));
  };

  const handleLogin = () => {
    const found = allUsers.find((u) => u.username === username && u.password === password);
    if (!found) {
      alert('Invalid credentials');
      return;
    }

    setIsRegistered(true);
    setUserData(found);
    setMessages(found.messages || []);
  };

  const handleSend = async () => {
    const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleString() };  // Store both date and time

    // Generate the bot reply from Gemini
    const botReplyContent = await generateBotReply(input);
    const botReply = { role: 'bot', content: botReplyContent, timestamp: new Date().toLocaleString() };  // Store both date and time

    const updated = [...messages, userMsg, botReply];

    const updatedUser = { ...userData, messages: updated };

    // Update the user data on MockAPI
    axios
      .put(`${API_URL}/${userData.id}`, updatedUser)
      .then((response) => {
        setMessages(updated);
        setInput('');
      })
      .catch((err) => console.error('Error updating user data:', err));
  };

  const generateBotReply = async (msg) => {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">GapAI</h2>

      {!isRegistered ? (
        <div>
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
          <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
          <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded ml-2">Login</button>
        </div>
      ) : (
        <div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
            {messages.map((m, i) => (
              <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                <span>{m.content}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="Type your message..."
            />
            <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeP;
