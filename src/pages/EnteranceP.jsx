import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/videos/dw.mp4';
import styles from '../scss/Enterance.module.scss';

// Preload HomeP
// const preloadHome = () => import('./HomeP');

const EnteranceP = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    // Preload HomeP immediately
    // preloadHome();  

    // Stop the video and navigate after 4 seconds
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; 
      }
      navigate('/home', { replace: true }); 
    }, 4000);

    // Block back button
    const handlePopState = () => navigate('/home', { replace: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return (
    <div className={styles['main']}>
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        src={LOGO}
        tabIndex="-1"
        aria-hidden="true"
        className={styles['video']}
      ></video>
    </div>
  );
};

export default EnteranceP;
