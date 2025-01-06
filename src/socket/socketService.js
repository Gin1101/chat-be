import WebSocket from "ws";
import redisClient from "../database/redisClient.js"
import Users from "../models/Users.js";
import { verifyToken } from "../middleware/auth.js";
import { checkRole } from "#src/helpers/roles.js";
// import ChatWS from "./chatSocket.js";
// import UserWs from "./userSocket.js";
// import UserModel from "#src/models/Users.js";

class SocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });

        // Redis Pub/Sub
        this.redisSubscriber = redisClient.duplicate();
        this.redisPublisher = redisClient;

        this.redisSubscriber.subscribe("chat");
        this.redisSubscriber.on("message", this.handleRedisMessage.bind(this));

        this.wss.on("connection", (ws, req) => {
            ws.isAlive = true;
            this.verifyMiddleware(ws, req);

            // Lắng nghe các sự kiện từ client
            this.onConnect(ws);

            // Heartbeat (giữ kết nối sống)
            ws.on("pong", () => {
                ws.isAlive = true;
            });
        });

        // Heartbeat interval
        setInterval(() => {
            this.wss.clients.forEach((client) => {
                if (!client.isAlive) return client.terminate();
                client.isAlive = false;
                client.ping();
            });
        }, 30000);
    }

    async verifyToken(ws, token) {
        try {
            const jwtDecode = verifyToken(token);
            const userById = await Users.findById(jwtDecode.id).lean();
            if (!userById) throw new Error("User not found");
            ws.user = { ...userById, id: String(userById._id) };
            ws.auth = true;

            ws.isAdmin = !!checkRole("admin", userById.role);
        } catch (error) {
            console.error("Token verification error:", error);
            ws.close(1008, "Authorization failed"); // Đóng kết nối với mã lỗi
        }
    }

    async verifyMiddleware(ws, req) {
        try {
            const token = req.headers.token || new URL(req.url, `http://${req.headers.host}`).searchParams.get("token");
            if (!token) throw new Error("Token not found");

            await this.verifyToken(ws, token);
        } catch (error) {
            console.error("Middleware error:", error);
            ws.close(1008, "Authorization error");
        }
    }

    onConnect(ws) {
        ws.on("message", async (message) => {
            try {
                const { event, data } = JSON.parse(message);

                if (event === "chat") {
                    // Gửi tin nhắn tới Redis Pub/Sub
                    this.redisPublisher.publish("chat", JSON.stringify({ sender: ws.user.id, data }));

                    // Phản hồi lại client gửi tin
                    ws.send(JSON.stringify({ status: "success", event, data }));
                }
            } catch (error) {
                console.error("Message handling error:", error);
            }
        });

        ws.on("close", () => this.onDisconnect(ws));
    }

    onDisconnect(ws) {
        console.log("Client disconnected:", ws.user?.id || "Unknown");
    }

    // Xử lý tin nhắn Redis nhận được
    handleRedisMessage(channel, message) {
        if (channel === "chat") {
            const parsedMessage = JSON.parse(message);
            const { sender, data } = parsedMessage;

            // Phát tin nhắn tới tất cả client WebSocket
            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: "chat", sender, data }));
                }
            });
        }
    }
}

export default SocketService;
