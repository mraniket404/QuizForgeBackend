// routes/user.js
import express from "express";
import { getProfile, getHistory, getLeaderboard } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/history", protect, getHistory);
router.get("/leaderboard", getLeaderboard);

export default router;
