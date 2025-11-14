import express from "express";
import { 
  Createquiz, 
  Deletequiz, 
  Editquiz, 
  Getquiz,
  GetQuizzesForCourse, // ✅ AJOUT
  SubmitQuiz // ✅ AJOUT
} from "../controllers/QuizController.js";
import authmiddle from "../middlewares/AuthMiddleware.js";
import rolemiddle from "../middlewares/RoleMiddleware.js";

const quizRouter = express.Router();

// ✅ Créer un quiz (prof/admin)
quizRouter.post("/", authmiddle, rolemiddle("admin", "prof"), Createquiz);

// ✅ Récupérer TOUS les quiz d'un cours
quizRouter.get("/course/:id", authmiddle, rolemiddle("admin", "prof", "student"), GetQuizzesForCourse);

// ✅ Récupérer UN quiz spécifique
quizRouter.get("/:id", authmiddle, rolemiddle("admin", "prof", "student"), Getquiz);

// ✅ Soumettre un quiz (étudiant)
quizRouter.post("/:id/submit", authmiddle, rolemiddle("admin", "student"), SubmitQuiz);

// ✅ Modifier un quiz
quizRouter.put("/:id", authmiddle, rolemiddle("admin", "prof"), Editquiz);

// ✅ Supprimer un quiz
quizRouter.delete("/:id", authmiddle, rolemiddle("admin", "prof"), Deletequiz);

export default quizRouter;