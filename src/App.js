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

  // 🛡️ Prevent swipe back / navigate back on iOS (PWA and Safari)
  useEffect(() => {
    const handleTouchStart = (e) => {
      // Start touch position
      touchStartX = e.touches[0].clientX;
    };

    let touchStartX = 0;
    const handleTouchMove = (e) => {
      // Prevent swipe-left if the touch starts from left (and ensure it's a swiping move)
      if (touchStartX < 50 && e.touches[0].clientX > touchStartX + 10) {
        e.preventDefault(); // Block the swipe
      }
    };

    const handleTouchEnd = (e) => {
      // Explicitly prevent back gesture on touch end if user was near the edge
      if (touchStartX < 50) {
        e.preventDefault();
      }
    };

    // Prevent browser back gesture
    const preventBack = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href); // Prevent back navigation
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Block the back swipe gesture when PWA is open in iOS Safari
    window.addEventListener('popstate', preventBack);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('popstate', preventBack);
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
