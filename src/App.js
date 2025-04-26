import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { lazy, Suspense, useState } from "react";
import EnteranceP from "./pages/EnteranceP";
import GetStartedP from "./pages/GetStartedP";
import RegisterP from "./pages/RegisterP";
import LoginP from "./pages/LoginP";

const ChatP = lazy(() => import("./pages/ChatP"));

function App() {
  const [user, setUser] = useState(null); // Store logged-in user

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser); // Update user state when logged in
  };

  const handleLogout = () => {
    setUser(null); // Clear user on logout
  };

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<EnteranceP />} />
          <Route path="/get-started" element={<GetStartedP />} />
          <Route path="/login" element={<LoginP onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterP onLogin={handleLogin} />} /> {/* Pass handleLogin */}
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
