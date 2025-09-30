import express from "express";
import cors from "cors"
import cookiePaser from "cookie-parser"
import dotenv from "dotenv"
import connect from "./db";
import http from "http"
import { initSocket } from "./service/socket.service";
import path from "path";


connect()
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname,"../public")))
app.use(express.json());
app.use(cookiePaser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}))

app.get("/", (req, res) => {
    res.send("One piece is Real!");
});

import {userRouter} from "./routes/user.route"
import {chatRouter} from "./routes/chat.routes"
import {messageRouter} from "./routes/message.route"

app.use("/users",userRouter)
app.use("/chats",chatRouter)
app.use("/messages",messageRouter)

const server = http.createServer(app);

initSocket(server);

app.get("*name",(req,res)=>{
  res.sendFile(path.join(__dirname,"../public/index.html"))
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});