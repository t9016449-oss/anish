const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Store users and their connections
const users = new Map();
const conversations = new Map();

// Serve static files from React build
app.use(express.static('client/build'));

// REST API endpoints
app.get('/api/users', (req, res) => {
  const userList = Array.from(users.values()).map(user => ({
    id: user.id,
    username: user.username,
    online: user.online
  }));
  res.json(userList);
});

app.get('/api/conversations/:userId', (req, res) => {
  const { userId } = req.params;
  const userConversations = Array.from(conversations.values())
    .filter(conv => conv.participants.includes(userId))
    .map(conv => ({
      id: conv.id,
      participants: conv.participants,
      messages: conv.messages
    }));
  res.json(userConversations);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User registration
  socket.on('register_user', (username) => {
    const userId = uuidv4();
    users.set(socket.id, {
      id: userId,
      username,
      socketId: socket.id,
      online: true
    });
    
    // Broadcast updated user list
    io.emit('users_updated', Array.from(users.values()).map(u => ({
      id: u.id,
      username: u.username,
      online: u.online
    })));
    
    socket.emit('user_registered', { userId, username });
    console.log(`${username} (${userId}) registered`);
  });

  // Start a conversation
  socket.on('start_conversation', (data) => {
    const { userId1, userId2, username1, username2 } = data;
    const conversationId = uuidv4();
    const participants = [userId1, userId2];
    
    conversations.set(conversationId, {
      id: conversationId,
      participants,
      messages: [],
      createdAt: new Date()
    });
    
    // Notify both users
    io.to(socket.id).emit('conversation_started', {
      conversationId,
      participants,
      otherUser: { id: userId2, username: username2 }
    });
    
    // Find and notify the other user
    const otherSocket = Array.from(users.entries()).find(
      ([_, user]) => user.id === userId2
    );
    if (otherSocket) {
      io.to(otherSocket[0]).emit('conversation_started', {
        conversationId,
        participants,
        otherUser: { id: userId1, username: username1 }
      });
    }
  });

  // Send message
  socket.on('send_message', (data) => {
    const { conversationId, userId, username, message } = data;
    const conversation = conversations.get(conversationId);
    
    if (conversation) {
      const messageObj = {
        id: uuidv4(),
        sender: { id: userId, username },
        content: message,
        timestamp: new Date(),
        read: false
      };
      
      conversation.messages.push(messageObj);
      
      // Broadcast message to conversation participants
      io.emit('new_message', {
        conversationId,
        message: messageObj
      });
      
      console.log(`Message from ${username}: ${message}`);
    }
  });

  // Mark message as read
  socket.on('mark_as_read', (data) => {
    const { conversationId, messageId } = data;
    const conversation = conversations.get(conversationId);
    
    if (conversation) {
      const message = conversation.messages.find(m => m.id === messageId);
      if (message) {
        message.read = true;
      }
    }
  });

  // User typing indicator
  socket.on('typing', (data) => {
    const { conversationId, username } = data;
    io.emit('user_typing', { conversationId, username });
  });

  socket.on('stop_typing', (data) => {
    const { conversationId } = data;
    io.emit('user_stopped_typing', { conversationId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      user.online = false;
      console.log(`${user.username} disconnected`);
      
      io.emit('users_updated', Array.from(users.values()).map(u => ({
        id: u.id,
        username: u.username,
        online: u.online
      })));
      
      users.delete(socket.id);
    }
  });
});

// Catch-all for React Router
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
