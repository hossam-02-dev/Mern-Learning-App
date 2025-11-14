import axios from "./axios";
export const GetAllcourses = () =>  axios.get("/courses");
export const Getcourse = (id) => axios.get(`/courses/${id}`);
export const Createcourse = (data) => axios.post("/courses" , data);
export const Editcourse = (id ,data) => axios.put( `/courses/${id}`, data);
export const Deletecourse = (id) => axios.delete(`/courses/${id}`);