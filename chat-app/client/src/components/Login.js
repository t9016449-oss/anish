import React, { useState } from 'react';

function Login({ onLogin, isConnecting }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    setError('');
    onLogin(username.trim());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💬 Friend Chat</h1>
        <p>Connect and chat with your friends in real-time</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isConnecting}
            autoFocus
          />
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Start Chatting'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
