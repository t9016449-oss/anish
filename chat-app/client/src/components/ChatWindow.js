import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';

function ChatWindow({ socket, user, selectedUser, selectedConversation, conversation }) {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('user_typing', (data) => {
      const { conversationId, username } = data;
      if (conversationId === selectedConversation) {
        setTypingUser(username);
      }
    });

    socket.on('user_stopped_typing', (data) => {
      const { conversationId } = data;
      if (conversationId === selectedConversation) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, [socket, selectedConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !selectedConversation) {
      return;
    }

    socket.emit('send_message', {
      conversationId: selectedConversation,
      userId: user.userId,
      username: user.username,
      message: messageInput.trim()
    });

    setMessageInput('');
    setIsTyping(false);
    socket.emit('stop_typing', { conversationId: selectedConversation });
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (!isTyping && selectedConversation) {
      setIsTyping(true);
      socket.emit('typing', {
        conversationId: selectedConversation,
        username: user.username
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', { conversationId: selectedConversation });
    }, 3000);
  };

  if (!selectedUser) {
    return (
      <div className="main-content">
        <div className="no-conversation">
          <p>👋 Select a friend to start chatting</p>
          <p style={{ fontSize: '12px', color: '#bbb' }}>Click on any friend in the list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="chat-header">
        <h2>{selectedUser.username} {!selectedUser.online && '(Offline)'}</h2>
      </div>

      <div className="messages-container">
        {conversation && conversation.messages.length > 0 ? (
          <>
            <MessageList
              messages={conversation.messages}
              currentUserId={user.userId}
            />
            {typingUser && (
              <div style={{ color: '#999', fontSize: '12px' }}>
                <em>{typingUser} is typing...</em>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="no-conversation">
            <p>No messages yet</p>
            <p style={{ fontSize: '12px', color: '#bbb' }}>Start the conversation!</p>
          </div>
        )}
      </div>

      <form className="input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={handleInputChange}
          disabled={!selectedConversation}
        />
        <button type="submit" disabled={!messageInput.trim() || !selectedConversation}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
