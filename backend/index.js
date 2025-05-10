import express from "express";
import { logger } from "./utils/logger.js";
import { connectDatabase } from "./database/connectDatabase.js";
import { PORT } from "./config/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json()); // parse json bodies in the request
app.use(cookieParser()); // parse cookies in the request
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("Hello World");
  });
}

app.use("/api/auth", authRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}
app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
  try {
    await connectDatabase();
  } catch (error) {
    logger.error(error);
  }
});
