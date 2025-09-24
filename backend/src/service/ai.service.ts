import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"

dotenv.config()
const ai = new GoogleGenAI({});

export async function genrateAnswer(content:any) {
    
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
  });

  return response.text
}

export async function genrateVector(content:string){
  const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: content,
        config: {
            outputDimensionality: 768
        }
    })
    return response.embeddings?.[0]?.values
}

export async function renameChat(messages:Array<string>){
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze the following messages and generate a short, clear, and descriptive title for the chat (no extra words): ${messages}`,
  });

  return response.text
}