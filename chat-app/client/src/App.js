import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatApp from './components/ChatApp';
import Login from './components/Login';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('user_registered', (data) => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    });

    setSocket(newSocket);

    // Check if user was previously logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    return () => {
      newSocket.close();
    };
  }, []);

  const handleLogin = (username) => {
    if (socket && isConnected) {
      socket.emit('register_user', username);
    } else {
      console.error('Socket not connected');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    if (socket) {
      socket.disconnect();
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} isConnecting={!isConnected} />;
  }

  return (
    <ChatApp socket={socket} user={user} onLogout={handleLogout} />
  );
}

export default App;
