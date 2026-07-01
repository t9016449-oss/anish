import React from 'react';

function Sidebar({ user, users, onSelectUser, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Friend Chat</h1>
      </div>
      
      <div className="user-info">
        <strong>{user.username}</strong>
        <p style={{ marginTop: '5px', fontSize: '11px' }}>
          {users.filter(u => u.online).length} friends online
        </p>
      </div>

      <div className="users-list">
        {users.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            No users available
          </div>
        ) : (
          users.map(friend => (
            <div
              key={friend.id}
              className="user-item"
              onClick={() => onSelectUser(friend)}
            >
              <div className={`status-indicator ${friend.online ? 'online' : ''}`} />
              <span className="user-name">{friend.username}</span>
              <span style={{ fontSize: '10px', color: '#999' }}>
                {friend.online ? 'Online' : 'Offline'}
              </span>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '10px 20px', borderTop: '1px solid #e0e0e0' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '8px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
