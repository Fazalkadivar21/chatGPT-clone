import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"

dotenv.config()
const ai = new GoogleGenAI({});

export async function genrateAnswer(content:string) {
    
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
  });

  return response.text
}

export async function renameChat(messages:Array<string>){
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze the following messages and generate a short, clear, and descriptive title for the chat (no extra words): ${messages}`,
  });

  return response.text
}