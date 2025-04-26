import React, { useState, useEffect } from 'react';
import { updateUser, generateBotReply } from '../api';
import styles from '../scss/Chat.module.scss';
import { FiSend } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa";


const ChatP = ({ user, onLogout }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(user ? user.messages : []);
  const [isLoading, setIsLoading] = useState(false); // NEW

 const handleSend = async () => {
  if (input.trim() === '') {
    return;
  }

  const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleString() };
  const updatedMessages = [...messages, userMsg];

  setMessages(updatedMessages); // Show user's message immediately
  setInput(''); // Clear the input
  setIsLoading(true); // Start loading (shows "Typing...")

  try {
    // ADD DELAY BEFORE BOT RESPONDS
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second

    const botContent = await generateBotReply(input);
    const botMsg = { role: 'bot', content: botContent, timestamp: new Date().toLocaleString() };

    const finalMessages = [...updatedMessages, botMsg];

    await updateUser(user.id, { ...user, messages: finalMessages });

    setMessages(finalMessages); // Add bot's reply
  } catch (err) {
    console.error('Error updating user or generating reply:', err);
  } finally {
    setIsLoading(false); // Done loading
  }
};


  if (!user) {
    return <div>Error: User not found. Please log in again.</div>;
  }

  return (
    <div className={styles['chat']}>
      <div className={styles['chat-title']}>
        <div>
            <FaChevronLeft />
        </div>
        <h2 className="text-xl font-bold">Chat</h2>
        {/* <button onClick={onLogout} className="text-red-500 underline">Logout</button> */}
      </div>

      <div className={styles['chat-container']}>
        {messages.map((m, i) => (
          <div key={i} className="space-y-2">
            {m.role === 'user' ? (
              <div className={styles['chat-user']}>
                <div className={styles['chat-user-avatar']}></div>
                <div className={styles['chat-user-message']}>{m.content}</div>
              </div>
            ) : (
              <div className={styles['chat-ai']}>
                <div className={styles['chat-ai-avatar']}></div>
                <div className={styles['chat-ai-message']}>{m.content}</div>
              </div>
            )}
          </div>
        ))}
        {/* Optional: Show loading indicator while waiting for AI */}
        {isLoading && (
          <div className={styles['chat-ai']}>
            <div className={styles['chat-ai-avatar']}></div>
            <div className={styles['chat-ai-message']}>Typing...</div>
          </div>
        )}
      </div>

      <div className={styles['chat-input']}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading} // Optional: disable input while waiting
        />
        <button onClick={handleSend} disabled={isLoading}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatP;
