import { Request, Response } from "express";
import { Message } from "../models/message.model";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "Invalid data" });
    
    const messages = await Message.find({ chat: id, user: req.user.id });
    if (messages.length === 0) return res.status(200).json({ message: "Chat is empty", messages: [] });

    return res.status(200).json({ message: "Messages fetched", messages });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get messages" });
  }
};
