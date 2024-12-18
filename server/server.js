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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "https://lottery-pos.vercel.app"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Add headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.toString().includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

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
