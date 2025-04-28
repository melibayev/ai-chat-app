// Inside HomeP.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomeP() {
  return (
    <div>
      <h1>Welcome to Home Page</h1>
      {/* Button to navigate to ChatP */}
      <Link to="/chat">
        <button>Go to Chat</button>
      </Link>
    </div>
  );
}

export default HomeP;
