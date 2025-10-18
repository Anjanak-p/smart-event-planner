import 'dotenv/config'; 
console.log('Gemini key:', process.env.GEMINI_API_KEY ? 'Loaded ✅' : 'Missing ❌');
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Route imports
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: ["https://my-mern-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
 /* origin: 'http://localhost:3000', // React app will run on this port
  credentials: true */
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Welcome to Smart Event Planner API!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/users",
      events: "/api/events",
      ai: "/api/ai"
    }
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ai", aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
});