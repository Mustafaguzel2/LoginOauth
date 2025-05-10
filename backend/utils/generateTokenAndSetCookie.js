import jwt from "jsonwebtoken";
import { logger } from "./logger.js";
import { JWT_SECRET, NODE_ENV } from "../config/config.js";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  logger.info(`Token set for user ${userId}`);
  return token;
};
