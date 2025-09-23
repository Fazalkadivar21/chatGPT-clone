import { Chat } from "../models/chat.model"
import { Message } from "../models/message.model"
import { genrateAnswer } from "./ai.service"

export const deleteMessages = async (chatId: string)=>{
    await Message.deleteMany({
        chat : chatId
    })
}

export const saveMessage = async (userId:string,chatId:string, content:string,sender: string)=>{
    await Message.create({
        user:userId,
        sender,
        content,
        chat: chatId
    })
}
