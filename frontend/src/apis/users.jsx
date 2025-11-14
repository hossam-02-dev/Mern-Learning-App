import axios from "./axios";

// ✅ Récupérer tous les utilisateurs (admin uniquement)
export const Getallusers = () => axios.get("/User");

// ✅ Récupérer SON propre profil (utilise le token pour identifier l'utilisateur)
export const Getprofile = () => axios.get("/User/me");

// ✅ Mettre à jour SON profil
export const Updateprofile = (data) => axios.put("/User/me", data);

// ✅ Supprimer un utilisateur par ID (admin uniquement)
export const Deleteuser = (id) => axios.delete(`/User/${id}`);