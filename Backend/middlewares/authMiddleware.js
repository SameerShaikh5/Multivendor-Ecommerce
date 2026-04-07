import User from "../models/UserModel.js";
import { TryCatch } from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";

export const authMiddleware = (roles = []) => TryCatch(
  async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
      throw new ErrorHandler(401, "You are not logged in");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)?.select("-password");

    if (!user) {
      throw new ErrorHandler(401, "User not found");
    }

    // attach user to request
    req.user = user;

    // role check (only if roles provided)
    if (roles.length && !roles.includes(user.role)) {
      throw new ErrorHandler(403, "Unauthorized access");
    }

    next();
  }
);
