import axios from "./axios";
export const GetAllpayements = () => axios.get("/paiement"); //admin uniquement
export const Getpayement = (id) => axios.get(`/paiement/${id}`);
export const Preparepayement = (data) => axios.post("/paiement/checkout" , data);
export const Verifypayement = (data) => axios.post("/paiement/verify" , data);
