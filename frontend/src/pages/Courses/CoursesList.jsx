import React, { useEffect, useState, useContext } from "react";
import { GetAllcourses } from "../../apis/Courses";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../Contexts/AuthContext";

const CoursesList = ({ onlyMyCourses = false }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { role } = useContext(TokenContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await GetAllcourses();
        if (res.data.success) {
          let data = res.data.data;
          if (onlyMyCourses) {
            // filtre selon l'utilisateur si nécessaire
            // ici backend doit renvoyer courses de l'étudiant connecté
          }
          setCourses(data);
        }
      } catch (error) {
        console.error("Erreur récupération des cours :", error);
      }
    };
    fetchCourses();
  }, [onlyMyCourses]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Bouton créer un cours pour admin/prof */}
      {(role === "admin" || role === "prof") && (
        <button
          onClick={() => navigate("/courses/new")}
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 mb-6"
        >
          Créer un cours
        </button>
      )}

      {courses.map((course) => (
        <div
          key={course._id}
          className="border rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          {course.thumbnail && (
            <img
              src={`http://localhost:4000${course.thumbnail}`}
              alt={course.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
          )}

          <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
          <p className="text-gray-700 mb-2">{course.description}</p>
          <p className="text-indigo-600 font-semibold mb-4">Prix : ${course.price}</p>

          <button
            onClick={() => navigate(`/courses/${course._id}`)}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:scale-105 transition-transform duration-300"
          >
            Voir le cours
          </button>
        </div>
      ))}
    </div>
  );
};

export default CoursesList;
