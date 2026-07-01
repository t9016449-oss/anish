import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

function ChatApp({ socket, user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('users_updated', (updatedUsers) => {
      setUsers(updatedUsers.filter(u => u.id !== user.userId));
    });

    socket.on('conversation_started', (data) => {
      const { conversationId, participants, otherUser } = data;
      setConversations(prev => ({
        ...prev,
        [conversationId]: {
          id: conversationId,
          participants,
          otherUser,
          messages: []
        }
      }));
      setSelectedConversation(conversationId);
      setSelectedUser(otherUser);
    });

    socket.on('new_message', (data) => {
      const { conversationId, message } = data;
      setConversations(prev => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          messages: [...(prev[conversationId]?.messages || []), message]
        }
      }));
    });

    // Request initial users list
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.filter(u => u.id !== user.userId));
      });

    return () => {
      socket.off('users_updated');
      socket.off('conversation_started');
      socket.off('new_message');
    };
  }, [socket, user.userId]);

  const handleSelectUser = (selectedUser) => {
    // Check if conversation already exists
    const existingConv = Object.values(conversations).find(
      conv => conv.otherUser?.id === selectedUser.id
    );

    if (existingConv) {
      setSelectedConversation(existingConv.id);
      setSelectedUser(selectedUser);
    } else {
      // Start new conversation
      socket.emit('start_conversation', {
        userId1: user.userId,
        userId2: selectedUser.id,
        username1: user.username,
        username2: selectedUser.username
      });
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        user={user}
        users={users}
        onSelectUser={handleSelectUser}
        onLogout={onLogout}
      />
      <ChatWindow
        socket={socket}
        user={user}
        selectedUser={selectedUser}
        selectedConversation={selectedConversation}
        conversation={selectedConversation ? conversations[selectedConversation] : null}
      />
    </div>
  );
}

export default ChatApp;
