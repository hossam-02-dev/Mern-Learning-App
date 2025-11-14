import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/AuthRoutes.js";
import courseRouter from "./routes/CoursesRoutes.js";
import progressRouter from "./routes/ProgressionRoutes.js";
import paiementRouter from "./routes/PaiementsRoutes.js";
import quizRouter from "./routes/QuizRoutes.js";
import connectDB from "./config/db.js";
import errorMiddleware from "./middlewares/ErrorMiddleware.js";
import userRouter from "./routes/UserRoutes.js";
import { StripeWebhook } from "./controllers/PaiementController.js";
import {setupSwagger} from "./swagger.js";
import cors from "cors";
import path from "path";
import morgan from "morgan";
dotenv.config();
 
const app = express();
connectDB();

app.post("/api/paiement/webhook/stripe", express.raw({ type: 'application/json' }), StripeWebhook );

app.use(express.json());  
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
  origin : process.env.FRONTEND_URL,
  credentials : true
}))


 const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/progress", progressRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/paiement", paiementRouter); 
app.use("/api/User" , userRouter);
setupSwagger(app);


app.use(errorMiddleware);


const port = process.env.PORT || 4000 ;

app.listen(port, () => {
  console.log( `Le serveur est lancé sur le port ${port}`);
}); 
