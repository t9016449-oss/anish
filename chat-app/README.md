# Friend Chat App 💬

A real-time chat application where you can connect with friends and chat instantly. Built with React and Node.js using WebSocket technology for seamless real-time communication.

## Features

✨ **Real-time Messaging** - Send and receive messages instantly  
👥 **User List** - See all online/offline friends  
🟢 **Online Status** - Know who's available right now  
⌨️ **Typing Indicators** - See when friends are typing  
📱 **Responsive Design** - Works on desktop and mobile  
💾 **Message History** - Keep track of conversations  

## Tech Stack

**Frontend:**
- React 18
- Socket.IO Client
- CSS3 (modern styling)

**Backend:**
- Node.js
- Express.js
- Socket.IO (for real-time communication)
- UUID (for unique identifiers)

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd client
npm install
cd ..
```

### 2. Setup Environment

Create `.env` file in root:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client && npm start
```

The app will open at `http://localhost:3000`

## Usage

1. **Enter your username** when you see the login screen
2. **See online friends** in the sidebar
3. **Click a friend** to start a conversation
4. **Type and send** messages in real-time

## Test with Multiple Users

Open multiple browser windows/tabs:
- Window 1: `http://localhost:3000` → Login as "Alice"
- Window 2: `http://localhost:3000` → Login as "Bob"
- Click "Alice" from Bob's friend list
- Start chatting!

## Socket.IO Events

### Client → Server
- `register_user` - Register with a username
- `start_conversation` - Start a new conversation
- `send_message` - Send a message
- `typing` - Send typing indicator
- `stop_typing` - Stop typing indicator

### Server → Client
- `users_updated` - List of all users updated
- `user_registered` - Registration confirmed
- `conversation_started` - Conversation created
- `new_message` - Receive new message
- `user_typing` - Friend is typing
- `user_stopped_typing` - Friend stopped typing

## Project Structure

```
chat-app/
├── server.js                  # Main Express server
├── package.json              # Backend dependencies
├── .env.example             # Environment template
│
└── client/                  # React frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── index.js
    │   ├── index.css
    │   ├── App.js
    │   └── components/
    │       ├── Login.js
    │       ├── ChatApp.js
    │       ├── Sidebar.js
    │       ├── ChatWindow.js
    │       └── MessageList.js
    └── package.json
```

## Future Features

- 🔐 User authentication
- 💾 Message persistence with database
- 👤 User profiles & avatars
- 👥 Group chats
- 📎 File sharing
- 📞 Video/Audio calls
- 🎨 Theme customization
- 🔔 Push notifications

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env |
| Can't connect | Ensure backend is running |
| No friends showing | Check backend at http://localhost:5000 |
| Messages not sending | Verify both users connected |

## License

MIT

Happy Chatting! 🎉
