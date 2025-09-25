import { createClient } from "redis";
import { getMessages } from "./message.service";

const client = createClient({
  username: process.env.REDIS_NAME!,
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_URL!,
    port: 16715,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => await client.connect())();

export const cacheMessages = async (chatId: string, messages: object[]) => {
  try {
    const chatKey = `chat:${chatId}:messages`;
    messages.map((m) => client.rPush(chatKey, JSON.stringify(m)));
    await client.lTrim(chatKey, -200, -1);
    await client.expire(chatKey, 60 * 60 * 24);
  } catch (error) {
    return error;
  }
};

export const getCachedMessages = async (
  chatId: string,
  userId: string
): Promise<any[]> => {
  try {
    
    const chatKey = `chat:${chatId}:messages`;
    const rawMessages = await client.lRange(chatKey, -20, -1);
    
    if (rawMessages.length > 0) {
      const messages = rawMessages.map((m) => JSON.parse(m));
      return messages;
    }else{
        const messages = await getMessages(chatId, userId);
        await cacheMessages(chatId,messages)
        return messages
    }    
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllCachedMessages = async (
  chatId: string,
): Promise<any[]> => {
    try {
        const chatKey = `chat:${chatId}:messages`;
        const rawMessages = await client.lRange(chatKey, 0, -1);
        const messages = rawMessages.map((m)=>JSON.parse(m))
        return messages
    } catch (error) {
        return []
    }
}
