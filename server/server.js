import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/user.route.js";
import shopRouter from "./routes/shop.route.js";
import ticketRouter from "./routes/ticket.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://lottery-pos.vercel.app",
];

app.use(cookieParser());
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Connect to MongoDB
connectDB().then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.get("/", (req, res) => {
  res.json({ 
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/ticket", ticketRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!", 
    message: err.message 
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    error: "Not Found",
    path: req.path 
  });
});

const PORT = process.env.PORT || 4000;

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
