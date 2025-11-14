import express from "express";
import { 
  GetProgressionAllcourses, 
  GetProgressionIncourse, 
  Createprogression,
  GetMyProgressInCourse  // ✅ AJOUT
} from "../controllers/ProgressionController.js";
import authmiddle from "../middlewares/AuthMiddleware.js";
import rolemiddle from "../middlewares/RoleMiddleware.js";

const progressRouter = express.Router();

// ✅ Récupérer MA progression dans TOUS mes cours (student)
progressRouter.get("/my-progress", authmiddle, rolemiddle("admin", "student"), GetProgressionAllcourses);

// ✅ Récupérer MA progression dans UN cours spécifique (student)
progressRouter.get("/course/:id", authmiddle, rolemiddle("admin", "student"), GetMyProgressInCourse);

// ✅ Récupérer la progression de TOUS les étudiants dans un cours (prof/admin)
progressRouter.get("/courses/:id", authmiddle, rolemiddle("admin", "prof"), GetProgressionIncourse);

// ✅ Créer/mettre à jour MA progression (student)
progressRouter.post("/", authmiddle, rolemiddle("admin", "student"), Createprogression);

export default progressRouter;