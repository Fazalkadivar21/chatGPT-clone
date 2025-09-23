import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { genrateAnswer } from "./ai.service";
import { Message } from "../models/message.model";
import jwt from "jsonwebtoken";
import { saveMessage } from "./message.service";
import { updateName } from "./chat.service";

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      // Attach user info to socket
      socket.data.user = decoded;

      next();
    } catch (err) {
      console.log("JWT verification failed:", err);
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join", ({ room }) => {
      socket.join(room);
    });

    socket.on("send", async (data) => {
      const { content, room } = data;
      saveMessage(socket.data.user.id, room, content, "user");
      const ans = await genrateAnswer(content);
      saveMessage(socket.data.user.id, room, ans!, "model");
      io.to(room).emit("receive", ans);
    });

    socket.on("change", async (data) => {
      const { room } = data;
      await updateName(socket.data.user.id,room)
      io.to(room).emit("update")
    });

    socket.on("leave", ({ room }) => {
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
