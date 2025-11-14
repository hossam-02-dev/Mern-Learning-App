import express from "express";
import { RefreshToken ,  Registeruser, Loginuser, Logoutuser } from "../controllers/AuthController.js";
import authmiddle from "../middlewares/AuthMiddleware.js";



const authRouter = express.Router();

authRouter.post("/register",   Registeruser );
authRouter.post("/login" ,   Loginuser );
authRouter.post("/refresh"  ,RefreshToken );
authRouter.post("/logout" , authmiddle ,Logoutuser );


export default authRouter;