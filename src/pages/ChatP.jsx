import React, { useState, useEffect, useRef } from 'react';
import { updateUser, generateBotReply } from '../api'; 
import styles from '../scss/Chat.module.scss';
import { FiSend } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa";

const ChatP = ({ user, onLogout }) => {
  const [input, setInput] = useState('');
  const [allChats, setAllChats] = useState([]); // all chats
  const [currentChatIndex, setCurrentChatIndex] = useState(0); // which chat is active
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const saved = JSON.parse(localStorage.getItem(`chat_${user.id}`));
          if (saved && saved.chats) {
            setAllChats(saved.chats);
            setCurrentChatIndex(0); // open the first chat by default
          } else {
            setAllChats([[]]); // start with one empty chat
          }
        } catch (error) {
          console.error('Error loading chats from localStorage:', error);
          setAllChats([[]]);
        }
      }
    };

    fetchChats();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [allChats, currentChatIndex]);

  const saveChatsToStorage = (updatedChats) => {
    localStorage.setItem(`chat_${user.id}`, JSON.stringify({ chats: updatedChats }));
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleString() };
    const updatedChats = [...allChats];
    updatedChats[currentChatIndex] = [...updatedChats[currentChatIndex], userMsg];

    setAllChats(updatedChats);
    saveChatsToStorage(updatedChats);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay

      const botContent = await generateBotReply(input);
      const botMsg = { role: 'bot', content: botContent, timestamp: new Date().toLocaleString() };

      updatedChats[currentChatIndex] = [...updatedChats[currentChatIndex], botMsg];

      await updateUser(user.id, { ...user, messages: updatedChats.flat() });

      setAllChats(updatedChats);
      saveChatsToStorage(updatedChats);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const updatedChats = [...allChats, []]; // add new empty chat
    setAllChats(updatedChats);
    setCurrentChatIndex(updatedChats.length - 1); // switch to the new chat
    saveChatsToStorage(updatedChats);
  };

  if (!user) {
    return <div>Error: User not found. Please log in again.</div>;
  }

  const currentMessages = allChats[currentChatIndex] || [];

  return (
    <div className={styles['chat']}>
      <div className={styles['chat-title']}>
        <div>
          <FaChevronLeft />
        </div>
        <h2 className="text-xl font-bold">Chat</h2>

        <button 
          onClick={handleNewChat}
          className="ml-auto px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          New Chat
        </button>
      </div>

      <div className={styles['chat-container']}>
        {currentMessages.map((m, i) => (
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
