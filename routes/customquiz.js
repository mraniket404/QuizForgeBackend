// routes/customquiz.js
import express from "express";
import { createQuiz, getAllQuiz, getQuizById, submitQuiz } from "../controllers/customQuizController.js";

const router = express.Router();

router.post("/create", createQuiz);
router.get("/all", getAllQuiz);  
router.get("/:id", getQuizById);
router.post("/:id/submit", submitQuiz);

export default router;