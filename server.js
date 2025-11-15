import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased from default 100kb to 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// routes
import authRoutes from "./routes/auth.js";
import dailyRoutes from "./routes/dailyquiz.js";
import customRoutes from "./routes/customquiz.js";
import userRoutes from "./routes/user.js";

app.use("/api/auth", authRoutes);
app.use("/api/dailyquiz", dailyRoutes);
app.use("/api/customquiz", customRoutes);
app.use("/api/user", userRoutes);

// Fix attempts endpoint
import Attempt from "./models/Attempt.js";
app.get("/api/attempts/:id", async (req, res) => {
  try {
    // Check if ID is valid
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'null') {
      return res.status(400).json({ message: "Invalid attempt ID" });
    }
    
    const a = await Attempt.findById(req.params.id);
    if (!a) return res.status(404).json({ message: "Attempt not found" });
    res.json(a);
  } catch (err) {
    console.error("Error fetching attempt:", err);
    res.status(500).json({ message: "Server error fetching attempt" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));