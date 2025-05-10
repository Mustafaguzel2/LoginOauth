import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import { JWT_SECRET } from "../config/config.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
