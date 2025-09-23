import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Types.ObjectId, ref: "Chat" },
    content: { type: String, required: true },
    sender: {
      type: String,
      enum: ["user", "model", "system"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
