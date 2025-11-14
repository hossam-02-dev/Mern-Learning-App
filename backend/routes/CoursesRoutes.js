import express from "express";
import {
  Getacourse,
  Getcourses,
  Editcourse,
  Createcourse,
  Deletecourse,
} from "../controllers/CourseController.js";
import authmiddle from "../middlewares/AuthMiddleware.js";
import rolemiddle from "../middlewares/RoleMiddleware.js";
import upload from "../middlewares/MulterMiddleware.js"; // ✅ Ajout du middleware d’upload

const courseRouter = express.Router();

// 📚 Routes publiques ou protégées
courseRouter.get("/", Getcourses);
courseRouter.get("/:id", authmiddle, rolemiddle("admin", "prof", "student"), Getacourse);

// 🧩 Route modifiée pour accepter les uploads
courseRouter.post(
  "/",
  authmiddle,
  rolemiddle("admin", "prof"),
  upload.fields([
    { name: "videos", maxCount: 5 },
    { name: "pdfs", maxCount: 5 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  Createcourse
);

// ✏️ Modification d’un cours
courseRouter.put(
  "/:id",
  authmiddle,
  rolemiddle("admin", "prof"),
  upload.fields([
    { name: "videos", maxCount: 5 },
    { name: "pdfs", maxCount: 5 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  Editcourse
);

// ❌ Suppression
courseRouter.delete("/:id", authmiddle, rolemiddle("admin", "prof"), Deletecourse);

export default courseRouter;
