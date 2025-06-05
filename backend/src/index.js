import express, { json } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import {connectDB} from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"

import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
        }

        // Gửi lại danh sách onlineUsers cho tất cả client
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
        // Xóa user khi mất kết nối
        for (const [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                break;
            }
        }

        // Cập nhật lại danh sách
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
});

server.listen(process.env.PORT || 7000, () => {
    console.log("Server running");
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // Cho phép gửi cookie/token
}));
app.use("/api/auth", authRoutes)
app.use ("/api/messages", messageRoutes)
app.set("io", io);
app.set("onlineUsers", onlineUsers);

app.listen(PORT, () => {
    console.log("Sever is running on PORT:" + PORT);
    connectDB();
});
