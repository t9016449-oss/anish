import React from 'react';

function MessageList({ messages, currentUserId }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sender.id === currentUserId ? 'sent' : 'received'}`}
        >
          <div>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default MessageList;
