import React, { useState, useEffect, useRef } from 'react';
import { updateUser, generateBotReply } from '../api';
import styles from '../scss/Chat.module.scss';
import { FiSend } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa";

const ChatP = ({ user, onLogout }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(user ? user.messages : []);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll whenever messages update
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') {
      return;
    }

    const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleString() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay for "typing..."

      const botContent = await generateBotReply(input);
      const botMsg = { role: 'bot', content: botContent, timestamp: new Date().toLocaleString() };

      const finalMessages = [...updatedMessages, botMsg];

      await updateUser(user.id, { ...user, messages: finalMessages });

      setMessages(finalMessages);
    } catch (err) {
      console.error('Error updating user or generating reply:', err);
    } finally {
      setIsLoading(false);
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

        {isLoading && (
          <div className={styles['chat-ai']}>
            <div className={styles['chat-ai-avatar']}></div>
            <div className={styles['chat-ai-message']}>Typing...</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className={styles['chat-input']}>
        <textarea
          type="text"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="resize-none"
        />
        <button onClick={handleSend} disabled={isLoading}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatP;
