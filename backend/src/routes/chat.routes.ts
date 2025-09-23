import { Router } from "express";
import { createChat,deleteChat,getChats } from "../controllers/chat.controller";
import { verifyUser } from "../middlewares/auth.middleware";

export const chatRouter:Router = Router()

chatRouter.use(verifyUser)

chatRouter.post("/create",createChat)
chatRouter.delete("/delete-chat",deleteChat)
chatRouter.get("/get-chats",getChats)