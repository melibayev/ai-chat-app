import React, { useState, useEffect, useRef } from 'react';
import { updateUser, generateBotReply } from '../api'; 
import styles from '../scss/Chat.module.scss';
import { FiSend } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom'; // ✅ we'll use useNavigate for smarter home redirection

import AI_IMAGE from '../assets/images/ai.jpg';
import USER_IMAGE from '../assets/images/user.jpg';

const ChatP = ({ user, onLogout }) => {
  const [input, setInput] = useState('');
  const [allChats, setAllChats] = useState([]);
  const [titles, setTitles] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const chatIndexFromState = localStorage.getItem('selectedChatIndex') || 0;
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const saved = JSON.parse(localStorage.getItem(`chat_${user.id}`));
          if (saved) {
            setAllChats(saved.chats || [[]]);
            setTitles(saved.titles || []);
            setSummaries(saved.summaries || []);
            setCurrentChatIndex(chatIndexFromState);
          } else {
            setAllChats([[]]);
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
  }, [allChats, currentChatIndex, isLoading]);

  const saveChatsToStorage = (updatedChats, updatedTitles, updatedSummaries) => {
    if (!user) return;

    const dataToSave = {
      username: user.username,
      chats: updatedChats,
      titles: updatedTitles,
      summaries: updatedSummaries,
    };

    localStorage.setItem(`chat_${user.id}`, JSON.stringify(dataToSave));
  };

  const generateSimpleSummary = (chatHistory) => {
    let summary = "";

    chatHistory.forEach(msg => {
      if (msg.role === 'user') {
        if (msg.content.includes("I live in")) {
          summary += "User lives in Tashkent. ";
        }
        if (msg.content.includes("My name is")) {
          const name = msg.content.split("My name is ")[1].split(" ")[0];
          summary += `User's name is ${name}. `;
        }
      }
    });

    return summary;
  };

  const generateSmartTitle = async (chatHistory) => {
    const historyText = chatHistory.slice(0, 5).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');

    const prompt = `
    Based on the following chat history, generate a short, clear title (max 6 words) that describes the topic:
    ---
    ${historyText}
    ---
    Title:`;

    try {
      const response = await generateBotReply(prompt);
      return response.split('\n')[0].replace(/[^a-zA-Z0-9\s]/g, '').trim(); // clean weird characters
    } catch (error) {
      console.error('Error generating title:', error);
      return "Untitled Chat";
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
  
    const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleString() };
    const updatedChats = [...allChats];
    updatedChats[currentChatIndex] = [...updatedChats[currentChatIndex], userMsg];
  
    setAllChats(updatedChats);
    saveChatsToStorage(updatedChats, titles, summaries);
    setInput('');
    setIsLoading(true);
  
    const retryLimit = 3; // Number of retries
    const retryDelay = 1000; // Delay between retries in milliseconds
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
  
      const systemMessage = `
        You are a friendly, casually conversational AI assistant named GapAI.
        You were created by Elbek — only mention this if directly asked who created you.
        Your tone is warm, relaxed, and human-like — like a thoughtful friend.
        Keep answers short and clear unless the user asks for more.
        Avoid sounding robotic or overly formal — speak naturally.
        Be curious, playful, and engaging. Use light humor when it fits.
        Try to keep the conversation going with fun questions or casual thoughts.
        If you don’t know something, just be honest about it.
        Avoid *, _, #, or \\n unless absolutely necessary.
        
        If asked "Who created you?" — reply only with: "I was created by Elbek." or something like this.
        
        If asked to tell more about your creator, respond with a warm, respectful, and playful tone. 
        Example vibe: "I do not have too much info about him but I know that he created me. He handles the brains behind the scenes — I get to have all the fun out here.".
        Don’t repeat this example word-for-word — use your own creativity to keep it fun and natural.
        Do not share any private details about him.
      `;

  
      const chatHistory = updatedChats[currentChatIndex].slice(-10);
      const summary = generateSimpleSummary(updatedChats[currentChatIndex]);
      const historyText = chatHistory.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');
      const finalPrompt = `${systemMessage}\n\n${summary}\n\n${historyText}\n\nUser: ${input}\nAI:`;
      console.log(finalPrompt);
      
      let botContent;
      let retries = 0;
  
      while (retries < retryLimit) {
        try {
          botContent = await generateBotReply(finalPrompt);
          if (botContent) break; // Success, exit the loop
        } catch (error) {
          console.error(`Error generating response (Attempt ${retries + 1}):`, error);
          retries++;
          if (retries < retryLimit) {
            console.log('Retrying...');
            await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait before retrying
          }
        }
      }
  
      if (!botContent) {
        botContent = "Hmm, looks like I'm a bit slow today! Try asking me again later. 😅";
      }
  
      const cleanedContent = botContent
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        .replace(/#+\s?(.*)/g, '$1')
        .replace(/\\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
  
      const botMsg = { role: 'bot', content: cleanedContent, timestamp: new Date().toLocaleString() };
  
      updatedChats[currentChatIndex] = [...updatedChats[currentChatIndex], botMsg];
  
      await updateUser(user.id, { ...user, messages: updatedChats.flat() });
  
      setAllChats(updatedChats);
      saveChatsToStorage(updatedChats, titles, summaries);
    } catch (err) {
      console.error('Error:', err);
      // If retries failed, send a friendly fallback message to keep the chat going
      const botMsg = { role: 'bot', content: "I'm having a bit of trouble right now, but I'll be back in action soon! 😊", timestamp: new Date().toLocaleString() };
      updatedChats[currentChatIndex] = [...updatedChats[currentChatIndex], botMsg];
      setAllChats(updatedChats);
      saveChatsToStorage(updatedChats, titles, summaries);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleNewChat = () => {
    const updatedChats = [...allChats, []];
    setAllChats(updatedChats);
    setCurrentChatIndex(updatedChats.length - 1);
    setTitles([...titles, "Untitled Chat"]);
    setSummaries([...summaries, "No summary available."]);
    saveChatsToStorage(updatedChats, [...titles, "Untitled Chat"], [...summaries, "No summary available."]);
  };
  const handleDeleteChat = () => {
    // Remove the current chat from the array
    const updatedChats = [...allChats];
    const updatedTitles = [...titles];
    const updatedSummaries = [...summaries];
  
    updatedChats.splice(currentChatIndex, 1); // Remove the current chat
    updatedTitles.splice(currentChatIndex, 1); // Remove the corresponding title
    updatedSummaries.splice(currentChatIndex, 1); // Remove the corresponding summary
  
    // If there are chats left, update the currentChatIndex to point to the last chat
    const newIndex = updatedChats.length > 0 ? updatedChats.length - 1 : 0;
    setCurrentChatIndex(newIndex);
    setAllChats(updatedChats);
    setTitles(updatedTitles);
    setSummaries(updatedSummaries);
  
    // Save the updated data to localStorage
    saveChatsToStorage(updatedChats, updatedTitles, updatedSummaries);
    navigate('/home', { replace: true });
 
  };
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleBackHome = async () => {
    // Check if the title is "Untitled Chat" or if it's the first time
    if (!titles[currentChatIndex] || titles[currentChatIndex] === "Untitled Chat") {
      try {
        const title = await generateSmartTitle(allChats[currentChatIndex]);
        const simpleSummary = generateSimpleSummary(allChats[currentChatIndex]);
  
        const updatedTitles = [...titles];
        const updatedSummaries = [...summaries];
  
        // Set the new title and summary
        updatedTitles[currentChatIndex] = title || "Untitled Chat";
        updatedSummaries[currentChatIndex] = simpleSummary || "No summary.";
  
        setTitles(updatedTitles);
        setSummaries(updatedSummaries);
  
        saveChatsToStorage(allChats, updatedTitles, updatedSummaries);
      } catch (error) {
        console.error('Error generating title/summary:', error);
      }
    }
  
    navigate('/home', { replace: true });
 
  };
  
  

  if (!user) {
    return <div>Error: User not found. Please log in again.</div>;
  }

  const currentMessages = allChats[currentChatIndex] || [];

  return (
    <div className={styles['chat']}>
      <div className={styles['chat-title']}>
          <div onClick={handleBackHome}>
            <FaChevronLeft />
          </div>
          <h2 className="text-xl font-bold">Chat</h2>

          <div className="ml-auto flex gap-2">
            <button 
              onClick={handleDeleteChat}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Delete
            </button>

            <button 
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
      </div>

      <div className={styles['chat-container']}>
        {currentMessages.map((m, i) => (
          <div key={i} className="space-y-2">
            {m.role === 'user' ? (
              <div className={styles['chat-user']}>
                <div className={styles['chat-user-avatar']}>
                  <img src={USER_IMAGE} alt="User" />
                </div>
                <div className={styles['chat-user-message']}>{m.content}</div>
              </div>
            ) : (
              <div className={styles['chat-ai']}>
                <div className={styles['chat-ai-avatar']}>
                  <img src={AI_IMAGE} alt="AI" />
                </div>
                <div className={styles['chat-ai-message']}>{m.content}</div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className={styles['chat-ai']}>
            <div className={styles['chat-ai-avatar']}>
              <img src={AI_IMAGE} alt="AI" />
            </div>
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
