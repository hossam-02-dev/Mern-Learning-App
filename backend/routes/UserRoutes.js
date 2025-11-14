import express from "express";
import { GetAllUsers, GetMyProfile, DeleteUser, UpdateMyProfile } from "../controllers/UserController.js";
import authmiddle from "../middlewares/AuthMiddleware.js";
import rolemiddle from "../middlewares/RoleMiddleware.js";

const userRouter = express.Router();

// ✅ Route pour obtenir tous les utilisateurs (admin uniquement)
userRouter.get("/", authmiddle, rolemiddle("admin"), GetAllUsers);

// ✅ Route pour obtenir SON propre profil (utilise req.user._id)
userRouter.get("/me", authmiddle, GetMyProfile);

// ✅ Route pour mettre à jour SON profil (utilise req.user._id)
userRouter.put("/me", authmiddle, UpdateMyProfile);

// ✅ Route pour supprimer un utilisateur (admin uniquement)
userRouter.delete("/:id", authmiddle, rolemiddle("admin"), DeleteUser);

export default userRouter;