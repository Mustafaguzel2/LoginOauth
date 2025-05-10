import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { MONGO_URI } from "../config/config.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
  }
};
