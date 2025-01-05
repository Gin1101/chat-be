import WebSocket from 'ws';
import http from 'http';
import redisClient from "../database/redisClient"
import Message from './models/Messages'; // MongoDB model
import { verifyToken } from '../middleware/auth'; // Phương thức xác thực token

const pubsub = redisClient.duplicate();
pubsub.connected();

// Tạo WebSocket server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Hàm xác thực JWT
const authenticateUser = (token) => {
  try {
    return verifyToken(token); // Kiểm tra token JWT
  } catch (err) {
    return null;
  }
};

wss.on('connection', (ws, req) => {
  // Xử lý xác thực người dùng khi kết nối
  const token = req.headers['sec-websocket-protocol']; // Token được gửi qua header
  const user = authenticateUser(token);

  if (!user) {
    ws.close(); // Đóng kết nối nếu không xác thực được user
    return;
  }

  ws.user = user; // Gán thông tin người dùng vào WebSocket instance

  console.log('User connected: ', user.username);

  // Lắng nghe tin nhắn từ client
  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    // Lưu tin nhắn vào MongoDB
    const newMessage = new MessageModel({
      sender: user.username,
      content: data.content,
      recipient: data.recipient,
      timestamp: new Date(),
    });
    await newMessage.save();

    // Publish tin nhắn lên Redis
    pubsub.publish('chat', JSON.stringify({ message: newMessage, recipient: data.recipient }));

    // Gửi phản hồi cho client
    ws.send(JSON.stringify({ status: 'ok', message: newMessage }));
  });

  // Lắng nghe sự kiện disconnect
  ws.on('close', () => {
    console.log(`User ${user.username} disconnected`);
  });
});

// Lắng nghe Redis để phát tin nhắn tới các client
pubsub.subscribe('chat', (message) => {
  const parsedMessage = JSON.parse(message);

  // Phát tin nhắn cho các client
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.user.username === parsedMessage.recipient) {
      client.send(JSON.stringify({ message: parsedMessage.message }));
    }
  });
});

server.listen(8080, () => {
  console.log('Server is running on ws://localhost:8080');
});
