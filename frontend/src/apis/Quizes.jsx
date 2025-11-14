import axios from "./axios";

// ✅ Créer un quiz (prof/admin)
export const Createquiz = (data) => axios.post("/quiz", data);

// ✅ Récupérer TOUS les quiz d'un cours
export const GetQuizzesForCourse = (courseId) => axios.get(`/quiz/course/${courseId}`);

// ✅ Récupérer UN quiz spécifique
export const Getquiz = (quizId) => axios.get(`/quiz/${quizId}`);

// ✅ Soumettre un quiz (étudiant)
export const SubmitQuiz = (quizId, answers) => axios.post(`/quiz/${quizId}/submit`, { answers });

// ✅ Modifier un quiz
export const Editquiz = (quizId, data) => axios.put(`/quiz/${quizId}`, data);

// ✅ Supprimer un quiz
export const Deletequiz = (quizId) => axios.delete(`/quiz/${quizId}`);