import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { lazy, Suspense, useState, useEffect } from "react";
import EnteranceP from "./pages/EnteranceP";
import GetStartedP from "./pages/GetStartedP";
import RegisterP from "./pages/RegisterP";
import LoginP from "./pages/LoginP";

const ChatP = lazy(() => import("./pages/ChatP"));

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    let touchStartX = 0;
  
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };
  
    const handleTouchMove = (e) => {
      const touchX = e.touches[0].clientX;
  
      if (touchStartX < 30 && touchX > touchStartX + 10) {
        // User is trying to swipe back from the left edge
        e.preventDefault();
      }
    };
  
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
  
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<EnteranceP />} />
          <Route path="/get-started" element={<GetStartedP />} />
          <Route path="/login" element={<LoginP onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterP onLogin={handleLogin} />} />
          <Route
            path="/chat"
            element={user ? <ChatP user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
