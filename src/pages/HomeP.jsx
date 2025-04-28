import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../scss/Home.module.scss';
import Slider from 'react-slick';
import { FaCrown } from "react-icons/fa";

import GALAXY_BG from '../assets/videos/galaxy.mp4';
import USER_IMG from '../assets/images/user.jpg';

function HomeP() {
  const [recentChats, setRecentChats] = useState([]);
  const [titles, setTitles] = useState([]);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      const chatData = JSON.parse(localStorage.getItem('chat_' + user.id));
      if (chatData && chatData.chats) {
        const chats = chatData.chats;
        const titles = chatData.titles;
        const lastThreeChats = chats.slice(-3).reverse(); // last 3, newest first
        const firstMessages = lastThreeChats.map((chat) => {
          const firstUserMessage = chat.find(message => message.role === 'user');
          return firstUserMessage ? firstUserMessage.content : 'No user message';
        });
        setRecentChats(firstMessages);
        setTitles(titles.slice(-3).reverse()); // Get last 3 titles
      }
    }
  }, []);

  useEffect(() => {
    const videoPlayed = localStorage.getItem('videoPlayed');
    if (!videoPlayed && videoRef.current) {
      videoRef.current.play();
      localStorage.setItem('videoPlayed', 'true');
    }
  }, []);

  const handleContinueClick = (index) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const chatData = JSON.parse(localStorage.getItem('chat_' + user.id));
    if (chatData && chatData.chats) {
      const totalChats = chatData.chats.length;
      const realIndex = totalChats - 1 - index; // map reversed index back
      localStorage.setItem('selectedChatIndex', realIndex);
    }
  };

  const handleNewChat = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const chatData = JSON.parse(localStorage.getItem('chat_' + user.id)) || { chats: [], titles: [], summaries: [] };
    const updatedChats = [...chatData.chats, []];
    const updatedTitles = [...chatData.titles, "Untitled Chat"];
    const updatedSummaries = [...chatData.summaries, "No summary available."];

    localStorage.setItem('chat_' + user.id, JSON.stringify({
      ...chatData,
      chats: updatedChats,
      titles: updatedTitles,
      summaries: updatedSummaries,
    }));

    // Navigate to the new chat page
    localStorage.setItem('selectedChatIndex', updatedChats.length - 1);
    navigate('/chat'); // Navigate to the chat page
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.7,
    swipeToSlide: true,
    touchMove: true,
  };

  return (
    <div className={styles['home']}>
      <div className={styles['home-settings']}>
        <h1>Good Morning!</h1>
        <div>
          <img src={USER_IMG} alt="" />
        </div>
      </div>

      <div className={styles['home-premium-offer']}>
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          src={GALAXY_BG}
          tabIndex="-1"
          aria-hidden="true"
        ></video>
        <div className={styles['home-premium-offer-info']}>
          <h4>Go Premium Today</h4>
          <p>Experience smarter, faster, and limitless conversations!</p>
          <button><FaCrown /> Upgrade Now</button>
        </div>
      </div>

      <div className={styles['home-automation']}>
        <h2>Suggestions</h2>
        <Slider {...settings}>
        <div>
            <div className={styles['home-automation-slick']}>
              <p>What's the best way to learn a new language?</p>
              <button>Generate</button>
            </div>
          </div>
          <div>
            <div className={styles['home-automation-slick']}>
              <p>What are the benefits of exercising daily?</p>
              <button>Generate</button>
            </div>
          </div>
          <div>
            <div className={styles['home-automation-slick']}>
              <p>How many countries are there in the world?</p>
              <button>Generate</button>
            </div>
          </div>
          <div>
            <div className={styles['home-automation-slick']}>
              <p>Can you tell me a fun fact about space.</p>
              <button>Generate</button>
            </div>
          </div>
          <div>
            <div className={styles['home-automation-slick']}>
              <p>What's the tallest building in the world?</p>
              <button>Generate</button>
            </div>
          </div>
          <div>
            <div className={styles['home-automation-slick']}>
              <p>Can you tell me what is Artificial Intelligence?</p>
              <button>Generate</button>
            </div>
          </div>
          <div>
            <div className={styles['home-automation-slick']}>
              <p>Tell me what is the capital of Uzbekistan</p>
              <button>Generate</button>
            </div>
          </div>
        </Slider>
      </div>

      <div className={styles['home-recent-chats']}>
        <h2>Recent Chats</h2>
        {recentChats.length === 0 ? (
          <div className={styles['no-recent-chats']}><p>No recent chats yet.</p></div>
        ) : (
          <div className={styles['home-recent-chats-list']}>
            {/* {titles.map((title, index) => (
              <div key={index} className={styles['home-recent-chat-item']}>
                <p>{title}</p>
                <Link to="/chat">
                  <button onClick={() => handleContinueClick(index)}>Continue</button>
                </Link>
              </div>
            ))} */}
            {titles.map((title, index) => (
              <Link to="/chat">
                <div key={index} onClick={() => handleContinueClick(index)} className={styles['home-recent-chat-item']}>
                  <p>{title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles['home-new-chat-button']}>
        <button onClick={handleNewChat}>New Chat</button>
      </div>
    </div>
  );
}

export default HomeP;
