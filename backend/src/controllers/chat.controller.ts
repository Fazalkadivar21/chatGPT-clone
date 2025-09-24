import { Request, Response } from "express";
import { Chat } from "../models/chat.model";
import { deleteMessages } from "../service/message.service";

export const createChat = async (req:Request,res:Response)=>{
    try {
        const user = req.user

        const chat = await Chat.create({
            user
        })

        return res.status(200).json({message : "Chat created",chat})
    } catch (error) {
        return res.status(500).json({message: "Failed to create chat"})
    }
}

export const getChats = async (req:Request,res:Response)=>{
    try {
        const chats = await Chat.find({ user: req.user.id }).sort({ createdAt: -1 });
        if(chats.length === 0) return res.status(200).json({message : "No chats yet.",chats})
            return res.status(200).json({message : "Chats fetched",chats})
    } catch (error) {
        return res.status(500).json({message: "Failed to get chats"})
    }
}

export const deleteChat = async (req:Request,res:Response)=>{
    try {
        const {id} = req.query
        if(!id) return res.status(400).json({message:"invalid data"})

            const exists = await Chat.findOne({_id:id,user:req.user.id})
            if(!exists) return res.status(404).json("Invalid data/chat does not exist")

            await Chat.deleteOne({_id: id})
            await deleteMessages(id as string)

            return res.status(200).json({message : "Chat deleted."})
    } catch (error) {
        return res.status(500).json({message: "Failed to delete chat"})
    }
}