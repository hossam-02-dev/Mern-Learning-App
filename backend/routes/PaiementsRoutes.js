import express from "express";
import { Getpaiement , Checkpaiement , Preparepaiement , GetAllPaiementsForUser } from "../controllers/PaiementController.js";
import authmiddle from "../middlewares/AuthMiddleware.js";
import rolemiddle from "../middlewares/RoleMiddleware.js";
import {FinalizePaiement} from "../controllers/PaiementController.js";

const paiementRouter = express.Router();

// ✅ Route pour préparer un paiement (MODIFICATION : student autorisé)
paiementRouter.post("/checkout", authmiddle, rolemiddle("admin", "student"), Preparepaiement);

// Route pour obtenir un paiement spécifique
paiementRouter.get("/:id", authmiddle, rolemiddle("admin", "student"), Getpaiement);

// Route pour obtenir TOUS les paiements (admin uniquement)
paiementRouter.get("/", authmiddle, rolemiddle("admin"), GetAllPaiementsForUser);

// Route pour vérifier un paiement (admin uniquement)
paiementRouter.post("/verify", authmiddle, rolemiddle("admin"), Checkpaiement);
paiementRouter.post("/finalize/:paymentId", authmiddle, rolemiddle("admin", "student"), FinalizePaiement);

export default paiementRouter;