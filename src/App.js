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
  // useEffect(() => {
  //   const handleTouchMove = (e) => {
  //     if (e.touches.length > 1) return; // allow pinch-zoom (but we disabled zoom anyway)
  //     const touch = e.touches[0];
  //     if (touch.clientX < 50 || touch.clientX > window.innerWidth - 50) {
  //       // If user starts swiping from edge of the screen → allow (for iOS Back gesture)
  //       return;
  //     }
  //     e.preventDefault(); // otherwise, block swipe
  //   };

  //   document.body.addEventListener('touchmove', handleTouchMove, { passive: false });

  //   return () => {
  //     document.body.removeEventListener('touchmove', handleTouchMove);
  //   };
  // }, []);

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
