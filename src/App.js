import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { lazy, Suspense, useState, useEffect } from "react";
import EnteranceP from "./pages/EnteranceP";
import GetStartedP from "./pages/GetStartedP";
import RegisterP from "./pages/RegisterP";
import LoginP from "./pages/LoginP";

const HomeP = lazy(() => import("./pages/HomeP"));  // HomeP Component
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

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<EnteranceP />} />
          <Route path="/get-started" element={<GetStartedP />} />
          <Route path="/login" element={<LoginP onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterP onLogin={handleLogin} />} />

          {/* If user is logged in, redirect to HomeP first */}
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />

          {/* Home page: Accessible if user is logged in */}
          <Route
            path="/home"
            element={user ? <HomeP /> : <Navigate to="/login" />}
          />

          {/* Chat page: Accessible if user is logged in */}
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
