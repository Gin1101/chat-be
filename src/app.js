import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import initRoute from "#src/routes.js";
import responseMiddleware from "#src/middleware/response.js";
import http from "http";
import SocketService from "./socket/socketService.js"; // Import WebSocket Service

const app = express();
const server = http.createServer(app);

// Khởi tạo WebSocket
new SocketService(server);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(responseMiddleware);
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// Khởi tạo route
initRoute(app);

export default server;
