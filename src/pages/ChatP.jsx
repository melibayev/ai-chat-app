import React, { useState, useEffect } from 'react';
import { updateUser, generateBotReply } from '../api';

const ChatP = ({ user, onLogout }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(user ? user.messages : []);

  const handleSend = async () => {
    const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleString() };
    const botContent = await generateBotReply(input);
    const botMsg = { role: 'bot', content: botContent, timestamp: new Date().toLocaleString() };

    const updatedMessages = [...messages, userMsg, botMsg];

    updateUser(user.id, { ...user, messages: updatedMessages })
      .then(() => {
        setMessages(updatedMessages);
        setInput('');
      })
      .catch((err) => console.error('Error updating user:', err));
  };

  // Ensure that user prop is passed
  if (!user) {
    return <div>Error: User not found. Please log in again.</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chat</h2>
        <button onClick={onLogout} className="text-red-500 underline">Logout</button>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}
          >
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
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatP;
