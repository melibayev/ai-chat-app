import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import EnteranceP from "./pages/EnteranceP";
import LoginP from './pages/LoginP'

const HomeP = lazy(() => import("./pages/HomeP"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<EnteranceP />} />
          <Route path="/login" element={<LoginP />} />
          <Route path="/home" element={<HomeP />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
