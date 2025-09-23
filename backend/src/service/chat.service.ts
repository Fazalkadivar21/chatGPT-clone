import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";
import { renameChat } from "./ai.service";

export const updateName = async (userId: string, chatId: string) => {
  const messages = await Message.find({ user: userId, chat: chatId });

  const msgs = messages.map((txt) => txt.content);
  const name = await renameChat(msgs);
  await Chat.findByIdAndUpdate(chatId, {
    name,
  });
};
