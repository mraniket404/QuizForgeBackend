import CustomQuiz from "../models/CustomQuiz.js";

export const createQuiz = async (req, res) => {
  try {
    const quiz = await CustomQuiz.create(req.body);

    return res.json({
      success: true,
      quizId: quiz._id,
      quiz,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/play/${quiz._id}`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error creating quiz" });
  }
};

export const getAllQuiz = async (req, res) => {
  try {
    const quizzes = await CustomQuiz.find().sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching quizzes" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await CustomQuiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    return res.json(quiz);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching quiz" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await CustomQuiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Calculate score
    let score = 0;
    answers.forEach((userAnswer, index) => {
      if (quiz.questions[index] && userAnswer === quiz.questions[index].answer) {
        score++;
      }
    });

    // Return results
    return res.json({
      success: true,
      score,
      total: quiz.questions.length,
      answers: quiz.questions.map(q => q.answer)
    });
  } catch (err) {
    return res.status(500).json({ message: "Error submitting quiz" });
  }
};