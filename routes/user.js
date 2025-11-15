import express from "express";
import { getProfile, getHistory, getLeaderboard, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile); // Add this line
router.get("/history", protect, getHistory);
router.get("/leaderboard", getLeaderboard);

export default router;