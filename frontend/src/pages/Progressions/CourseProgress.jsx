import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetProgressInCourse } from "../../apis/Progress";
import { Getcourse } from "../../apis/Courses";
import ProgressBar from "../../components/ProgressBar";
import { Users, Loader, ArrowLeft, Mail, TrendingUp } from "lucide-react";

const CourseProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Récupérer les infos du cours
      const courseRes = await Getcourse(id);
      if (courseRes.data.success) {
        setCourse(courseRes.data.data);
      }

      // Récupérer la progression des étudiants
      const progressRes = await GetProgressInCourse(id);
      if (progressRes.data.success) {
        setProgressData(progressRes.data.data);
      }
    } catch (err) {
      console.error("Erreur récupération des données :", err);
      setError("Erreur lors du chargement des progressions");
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = () => {
    const totalStudents = progressData.length;
    const completedStudents = progressData.filter((p) => p.progresspourcent === 100).length;
    const averageProgress =
      totalStudents > 0
        ? Math.round(progressData.reduce((sum, p) => sum + p.progresspourcent, 0) / totalStudents)
        : 0;

    return { totalStudents, completedStudents, averageProgress };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto p-6 text-center min-h-screen flex flex-col justify-center">
        <p className="text-red-500 text-xl mb-4">{error || "Cours introuvable"}</p>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Retour aux cours
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
      {/* Bouton retour */}
      <button
        onClick={() => navigate(`/courses/${id}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au cours
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Progression des étudiants</h1>
        <p className="text-indigo-100 text-lg">{course.title}</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-semibold">Étudiants inscrits</p>
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.totalStudents}</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-semibold">Ont terminé</p>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.completedStudents}</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-semibold">Progression moyenne</p>
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.averageProgress}%</p>
        </div>
      </div>

      {/* Liste des étudiants */}
      {progressData.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Aucun étudiant inscrit pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Liste des étudiants</h2>
          </div>

          <div className="divide-y">
            {progressData.map((progress) => (
              <div key={progress._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {progress.studentId.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{progress.studentId.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{progress.studentId.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600">{progress.progresspourcent}%</p>
                    <p className="text-sm text-gray-600">
                      {progress.completedChapters?.length || 0} chapitres
                    </p>
                  </div>
                </div>

                {/* Barre de progression */}
                <ProgressBar progress={progress.progresspourcent} showLabel={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseProgress;