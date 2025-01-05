const WebSocket = require('ws');
const mongoose = require('mongoose');
const redis = require('redis');

import User from "../models/Users"
import Messages from "../models/Messages"
import { verifyToken } from "../middleware/auth";

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Kết nối Redis
const pubClient = redis.createClient();
const subClient = redis.createClient();
subClient.subscribe('chat');

// Tạo server WebSocket
const wss = new WebSocket.Server({ port: 8080 });

// Lưu các kết nối WebSocket
const clients = new Map();

// Xử lý WebSocket kết nối
wss.on('connection', (ws, req) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'auth') {
      // Xác thực
      const user = verifyToken(data.token);
      if (user) {
        ws.user = user;
        clients.set(user.username, ws);
        ws.send(JSON.stringify({ type: 'auth-success', role: user.role }));
      } else {
        ws.close();
      }
    } else if (data.type === 'message') {
      // Gửi tin nhắn
      const { content } = data;
      const sender = ws.user.username;

      const newMessage = new Message({ sender, content });
      await newMessage.save();

      // Gửi tới Redis Pub/Sub
      pubClient.publish('chat', JSON.stringify({ sender, content }));
    }
  });

  // Gửi tin nhắn từ Redis tới các client
  subClient.on('message', (channel, message) => {
    if (channel === 'chat') {
      const msg = JSON.parse(message);
      if (msg.sender === 'admin') {
        clients.forEach((client) => client.send(JSON.stringify({ type: 'message', ...msg })));
      } else {
        const admin = clients.get('admin');
        if (admin) admin.send(JSON.stringify({ type: 'message', ...msg }));
      }
    }
  });

  // Xóa kết nối khi client thoát
  ws.on('close', () => {
    if (ws.user) clients.delete(ws.user.username);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
