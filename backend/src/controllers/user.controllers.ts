import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Blist } from "../models/blacklist.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    if (!(email && username && password))
      return res.status(400).json({ message: "Inlavid data" });

    const exists = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (exists)
      return res.status(400).json({ message: "User already exists." });

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .json({ message: "user created.", user:{username},token });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register you." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!(username && password))
      return res.status(400).json({ message: "invalid data." });

    const user = await User.findOne({ username: username }).select("+password");
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isValid = user.comparePassword(password);
    if (!isValid)
      return res.status(400).json({ message: "invalid username/password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .json({ message: "Login successfull",user:{ username}, token });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log you in." });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token found to log out." });
    }

    await Blist.create({ token });
    res.clearCookie("token", { httpOnly: true, secure: true });
    
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log you out." });
  }
};
