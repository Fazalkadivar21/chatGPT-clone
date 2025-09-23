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
    contents: `hey analys these messages and give a title to the chat no extra words just title messages : ${messages}`,
  });

  return response.text
}