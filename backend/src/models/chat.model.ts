import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    name: { type: String, default: "New chat" },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat",chatSchema)