import Quiz from "../models/QuizModel.js";
import Course from "../models/CourseModel.js";
import Progress from "../models/ProgressionModel.js"; // ✅ AJOUTER

export const Createquiz = async (req, res) => {
  const { courseId, title, questions, duration, points, isActive } = req.body;

  try {
    if (!courseId || !title || !questions || !duration || !points || isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs."
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Le cours ayant l'identifiant : ${courseId} est introuvable.`
      });
    }

    // Validation des questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.questionText || typeof question.questionText !== "string" || question.questionText.trim() === "") {
        return res.status(400).json({
          success: false,
          message: `La question numéro ${i + 1} est invalide : le texte de la question est requis.`
        });
      }

      if (!Array.isArray(question.options) || question.options.length < 2) {
        return res.status(400).json({
          success: false,
          message: `La question numéro ${i + 1} est invalide : elle doit contenir au moins deux options.`
        });
      }

      if (
        question.correctAnswer === undefined ||
        question.correctAnswer === null ||
        !question.options.includes(question.correctAnswer)
      ) {
        return res.status(400).json({
          success: false,
          message: `La question numéro ${i + 1} est invalide : la réponse correcte doit être définie et incluse dans les options.`
        });
      }
    }

    const createdby = req.user._id;

    const createaquiz = await Quiz.create({
      courseId,
      title,
      questions,
      duration,
      points,
      isActive,
      createdby
    });

    return res.status(201).json({
      success: true,
      message: `Le quiz "${title}" est créé avec succès.`,
      data: createaquiz
    });
  } catch (error) {
    console.error("❌ Erreur Createquiz:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de création du quiz."
    });
  }
};

export const Getquiz = async (req, res) => {
  try {
    const getaquiz = await Quiz.findById(req.params.id)
      .populate("courseId", "title description");

    if (!getaquiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz introuvable."
      });
    }

    return res.status(200).json({
      success: true,
      message: `Le quiz ayant l'identifiant ${req.params.id} a été récupéré avec succès.`,
      data: getaquiz
    });
  } catch (error) {
    console.error("❌ Erreur Getquiz:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de récupération du quiz."
    });
  }
};

export const GetQuizzesForCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const quizzes = await Quiz.find({ courseId })
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: `Quiz du cours récupérés avec succès.`,
      data: quizzes
    });
  } catch (error) {
    console.error("❌ Erreur GetQuizzesForCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de récupération des quiz."
    });
  }
};

export const Editquiz = async (req, res) => {
  try {
    const editquiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!editquiz) {
      return res.status(404).json({
        success: false,
        message: `Quiz ayant l'identifiant : ${req.params.id} est introuvable.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Quiz ayant l'identifiant : ${req.params.id} est modifié.`,
      data: editquiz
    });
  } catch (error) {
    console.error("❌ Erreur Editquiz:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de modification du quiz."
    });
  }
};

export const Deletequiz = async (req, res) => {
  try {
    const deleteaquiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!deleteaquiz) {
      return res.status(404).json({
        success: false,
        message: `Quiz ayant l'identifiant : ${req.params.id} est introuvable.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Le quiz ayant l'identifiant : ${req.params.id} est supprimé avec succès.`,
      data: deleteaquiz
    });
  } catch (error) {
    console.error("❌ Erreur Deletequiz:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de suppression du quiz."
    });
  }
};

// ✅ FONCTION MISE À JOUR - Compatible avec TakeQuiz.jsx
export const SubmitQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // Format: [{questionIndex: 0, answer: "réponse"}]
    const userId = req.user._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz introuvable."
      });
    }

    // ✅ Calculer le score
    let correctCount = 0;
    const results = [];

    quiz.questions.forEach((question, index) => {
      // ✅ Support pour le format envoyé par TakeQuiz.jsx
      let userAnswer;
      
      if (Array.isArray(answers)) {
        // Format: [{questionIndex: 0, answer: "réponse"}]
        const answerObj = answers.find(a => a.questionIndex === index);
        userAnswer = answerObj ? answerObj.answer : "";
      } else {
        // Format objet: {0: "réponse", 1: "réponse"}
        userAnswer = answers[index] || "";
      }
      
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) correctCount++;

      results.push({
        questionIndex: index,
        questionText: question.questionText,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    });

    const score = Math.round((correctCount / quiz.questions.length) * quiz.points);
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = percentage >= 50;

    // ✅ Mettre à jour la progression dans MongoDB
    try {
      await Progress.findOneAndUpdate(
        { studentId: userId, courseId: quiz.courseId },
        {
          $push: {
            quizScores: { quizId: quiz._id, score }
          }
        },
        { upsert: true, new: true }
      );
    } catch (progressError) {
      console.error("⚠️ Erreur mise à jour progression:", progressError);
      // On continue même si la progression échoue
    }

    // ✅ Format de réponse attendu par TakeQuiz.jsx
    return res.status(200).json({
      success: true,
      message: "Quiz soumis avec succès.",
      data: {
        score,
        correctCount, // ✅ TakeQuiz.jsx attend "correctCount"
        totalQuestions: quiz.questions.length,
        passed,
        percentage,
        results, // Pour afficher les détails
        quizId: quiz._id,
        userId
      }
    });
  } catch (error) {
    console.error("❌ Erreur SubmitQuiz:", error);
    return res.status(500).json({
      success: false,
      message: "Échec de soumission du quiz.",
      error: error.message
    });
  }
};