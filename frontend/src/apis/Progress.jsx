import axios from "./axios";

// ✅ Récupérer MA progression dans TOUS mes cours
export const GetMyProgress = () => axios.get("/progress/my-progress");

// ✅ Récupérer MA progression dans UN cours spécifique
export const GetMyProgressInCourse = (courseId) => axios.get(`/progress/course/${courseId}`);

// ✅ Récupérer la progression de TOUS les étudiants dans un cours (prof/admin)
export const GetProgressInCourse = (courseId) => axios.get(`/progress/courses/${courseId}`);

// ✅ Créer/mettre à jour MA progression
export const UpdateProgress = (data) => axios.post("/progress", data);