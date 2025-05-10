import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  MONGO_URI,
  LOG_LEVEL,
  NODE_ENV,
  JWT_SECRET,
  MAILTRAP_TOKEN,
  CLIENT_URL,
} = process.env;