import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetMyProgress } from "../../apis/Progress";
import ProgressBar from "../../components/ProgressBar";
import { TrendingUp, Loader, BookOpen, Trophy, Target } from "lucide-react";

const UserProgress = () => {
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await GetMyProgress();
      if (res.data.success) {
        setProgressData(res.data.data);
      } else {
        setError("Impossible de récupérer vos progressions");
      }
    } catch (err) {
      console.error("Erreur récupération des progressions :", err);
      setError("Erreur lors du chargement de vos progressions");
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = () => {
    const totalCourses = progressData.length;
    const completedCourses = progressData.filter((p) => p.progresspourcent === 100).length;
    const averageProgress =
      totalCourses > 0
        ? Math.round(progressData.reduce((sum, p) => sum + p.progresspourcent, 0) / totalCourses)
        : 0;

    return { totalCourses, completedCourses, averageProgress };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6 pt-24 flex justify-center items-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 pt-24 text-center min-h-screen flex flex-col justify-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (progressData.length === 0) {
    return (
      <div className="container mx-auto p-6 pt-24 text-center min-h-screen flex flex-col justify-center">
        <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Aucune progression</h2>
        <p className="text-gray-600 mb-6">Commencez votre premier cours pour voir votre progression ici.</p>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition mx-auto"
        >
          Explorer les cours
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-24 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ma Progression</h1>
          <p className="text-gray-600">Suivez votre avancement dans vos cours</p>
        </div>
        <TrendingUp className="w-12 h-12 text-indigo-600" />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Cours suivis</p>
            <BookOpen className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{stats.totalCourses}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Cours terminés</p>
            <Trophy className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{stats.completedCourses}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Progression moyenne</p>
            <Target className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{stats.averageProgress}%</p>
        </div>
      </div>

      {/* Liste des cours */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold">Vos cours en cours</h2>

        {progressData.map((progress) => (
          <div
            key={progress._id}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition cursor-pointer"
            onClick={() => navigate(`/courses/${progress.courseId._id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{progress.courseId.title}</h3>
                <p className="text-gray-600 line-clamp-2">{progress.courseId.description}</p>
              </div>
              {progress.courseId.thumbnail && (
                <img
                  src={`http://localhost:4000${progress.courseId.thumbnail}`}
                  alt={progress.courseId.title}
                  className="w-24 h-24 object-cover rounded-xl ml-4"
                />
              )}
            </div>

            {/* Barre de progression */}
            <ProgressBar progress={progress.progresspourcent} size="lg" />

            {/* Statistiques du cours */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
              <span>📹 {progress.completedChapters?.length || 0} chapitres complétés</span>
              {progress.quizScores?.length > 0 && (
                <span>📝 {progress.quizScores.length} quiz réalisés</span>
              )}
            </div>

            {/* Bouton */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/courses/${progress.courseId._id}`);
              }}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              {progress.progresspourcent === 100 ? "Revoir le cours" : "Continuer le cours"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProgress;