// routes/dailyquiz.js
import express from "express";
import { getToday, submitDaily } from "../controllers/dailyQuizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/today", protect, getToday); // require auth
router.post("/submit", protect, submitDaily);

export default router;
