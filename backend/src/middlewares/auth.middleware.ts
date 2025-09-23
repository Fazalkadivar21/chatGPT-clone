import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model.js";

// Extend Express Request to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

interface JwtPayload {
  id: string; // token only contains user ID
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers["authorization"];
    const headerToken =
      typeof authHeader === "string" ? authHeader.replace("Bearer ", "") : undefined;

    token = req.cookies?.accessToken || headerToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    req.user = user;

    next();
  } catch (error: any) {
    return res.status(401).json({ message: error?.message || "Invalid access token" });
  }
};
