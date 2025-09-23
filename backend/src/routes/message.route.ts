import { Router } from "express";
import { getMessages } from "../controllers/message.controller";
import { verifyUser } from "../middlewares/auth.middleware";

export const messageRouter: Router = Router()

messageRouter.get("/",verifyUser,getMessages)