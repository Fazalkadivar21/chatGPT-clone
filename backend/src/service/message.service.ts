import { Chat } from "../models/chat.model"
import { Message } from "../models/message.model"
import { genrateAnswer } from "./ai.service"

export const deleteMessages = async (chatId: string)=>{
    await Message.deleteMany({
        chat : chatId
    })
}

export const saveMessage = async (userId:string,chatId:string, content:string,sender: string)=>{
    const message = await Message.create({
        user:userId,
        sender,
        content,
        chat: chatId
    })
    return {id:message._id,user:message.user,chat:message.chat,text:message.content}
}

export const getMesages = async(chatId:string,userId:string)=>{
    return await Message.find({chat:chatId,user:userId}).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())
}
