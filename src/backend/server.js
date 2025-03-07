import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Allow frontend URL
  credentials: true // Allow cookies if needed
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));