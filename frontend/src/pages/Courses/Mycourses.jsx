import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllcourses } from "../../apis/Courses";
import ProgressBar from "../../components/ProgressBar"; // ✅ AJOUT

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // ⚠️ TEMPORAIRE : Pour l'instant on récupère tous les cours
        // TODO : Créer une route backend /api/courses/my-courses qui retourne uniquement les cours achetés
        const res = await GetAllcourses();
        
        if (res.data.success) {
          // En production, le backend doit filtrer les cours achetés par l'utilisateur connecté
          setMyCourses(res.data.data || []);
        }
      } catch (error) {
        console.error("Erreur récupération de mes cours :", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-xl">Chargement de vos cours...</p>
      </div>
    );
  }

  if (myCourses.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center space-y-6 mt-20">
        <h1 className="text-3xl font-bold">Mes Cours</h1>
        <p className="text-gray-600 text-lg">Vous n'avez acheté aucun cours pour le moment.</p>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Explorer les cours disponibles
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">Mes Cours Achetés</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((course) => (
          <div
            key={course._id}
            className="border rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
          >
            {course.thumbnail && (
              <img
                src={`http://localhost:4000${course.thumbnail}`}
                alt={course.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}

            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/courses/${course._id}`)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:scale-105 transition-transform duration-300"
              >
                Continuer
              </button>
              
              {/* Bouton pour accéder au quiz si disponible */}
              <button
                onClick={() => navigate(`/quiz/course/${course._id}`)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:scale-105 transition-transform duration-300"
              >
                Quiz
              </button>
            </div>

            {/* ✅ REMPLACEMENT : Utilisation du composant ProgressBar */}
            <div className="mt-4">
              <ProgressBar progress={course.progress || 0} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;