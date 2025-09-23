import mongoose from "mongoose";

const blistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 7 * 24 * 60 * 60 }
});

export const Blist = mongoose.model("Blist", blistSchema);
