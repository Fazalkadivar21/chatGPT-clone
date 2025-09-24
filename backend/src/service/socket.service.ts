import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { genrateAnswer, genrateVector } from "./ai.service";
import { Message } from "../models/message.model";
import jwt from "jsonwebtoken";
import { getMesages, saveMessage } from "./message.service";
import { updateName } from "./chat.service";
import { createMemory, queryMemory } from "./vector.service";

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
      const question = await saveMessage(
        socket.data.user.id,
        room,
        content,
        "user"
      );
      const qvector = await genrateVector(content);
      if (qvector) {
        await createMemory({
          vectors: qvector,
          messageId: question.id.toString(),
          metadata: {
            text: question.text,
            user: question.user!.toString(),
            chat: question.chat!.toString(),
          },
        });
      }

      const [memory, chatHistory] = await Promise.all([
        await queryMemory({
          queryVector: qvector!,
          limit: 5,
          metadata: {
            user: socket.data.user.id,
            chat: room
          },
        }),

        await getMesages(room, socket.data.user.id),
      ]);

      const stm = chatHistory.map((item) => {
        return {
          role: item.sender,
          parts: [{ text: item.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `
                      these are some previous messages from the chat, use them to generate a response
                      ${memory.map((item) => item.metadata.text).join("\n")}
                      `,
            },
          ],
        },
      ];

      const ans = await genrateAnswer([...ltm, ...stm]);
      const answer = await saveMessage(
        socket.data.user.id,
        room,
        ans!,
        "model"
      );
      const avector = await genrateVector(content);
      if (avector) {
        await createMemory({
          vectors: avector,
          messageId: answer.id.toString(),
          metadata: {
            text: answer.text,
            user: answer.user!.toString(),
            chat: answer.chat!.toString(),
          },
        });
      }
      io.to(room).emit("receive", ans);
    });

    socket.on("change", async (data) => {
      const { room } = data;
      await updateName(socket.data.user.id, room);
      io.to(room).emit("update");
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
