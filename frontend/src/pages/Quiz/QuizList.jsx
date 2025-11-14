import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetQuizzesForCourse } from "../../apis/Quizes";
import { Clock, Award, PlayCircle, CheckCircle, Lock } from "lucide-react";

const QuizList = ({ courseId, isEnrolled, userProgress }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ LOG: Props reçues au montage
  console.log("🔵 ========== QuizList MONTÉ ==========");
  console.log("📚 courseId reçu:", courseId);
  console.log("🔓 isEnrolled:", isEnrolled);
  console.log("📊 userProgress:", userProgress);
  console.log("=====================================");

  useEffect(() => {
    if (courseId) {
      console.log("✅ courseId existe, on lance fetchQuizzes");
      fetchQuizzes();
    } else {
      console.warn("⚠️ Pas de courseId, fetchQuizzes non lancé");
    }
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      
      console.log("🔍 ========== RÉCUPÉRATION DES QUIZ ==========");
      console.log("🔍 Course ID utilisé:", courseId);
      console.log("🔍 Appel API: /quiz/course/" + courseId);
      
      const res = await GetQuizzesForCourse(courseId);
      
      console.log("📦 ========== RÉPONSE API ==========");
      console.log("📦 Réponse complète:", res);
      console.log("📦 res.data:", res.data);
      console.log("📦 res.data.success:", res.data.success);
      console.log("📦 res.data.data:", res.data.data);
      
      if (res.data.success) {
        console.log("✅ ========== QUIZ RÉCUPÉRÉS ==========");
        console.log("✅ Nombre de quiz:", res.data.data.length);
        
        // Afficher les détails de chaque quiz
        res.data.data.forEach((q, index) => {
          console.log(`📝 Quiz ${index + 1}:`, {
            _id: q._id,
            title: q.title,
            duration: q.duration,
            points: q.points,
            isActive: q.isActive,
            questionsCount: q.questions?.length,
            courseId: q.courseId
          });
        });
        
        console.log("======================================");
        
        setQuizzes(res.data.data);
      } else {
        console.error("❌ res.data.success est false");
      }
    } catch (err) {
      console.error("❌ ========== ERREUR RÉCUPÉRATION QUIZ ==========");
      console.error("❌ Erreur complète:", err);
      console.error("❌ Message:", err.message);
      console.error("❌ Response:", err.response);
      console.error("❌ Response status:", err.response?.status);
      console.error("❌ Response data:", err.response?.data);
      console.error("=================================================");
      setError("Impossible de charger les quiz");
    } finally {
      setLoading(false);
    }
  };

  const getQuizScore = (quizId) => {
    if (!userProgress?.quizScores) return null;
    const scoreData = userProgress.quizScores.find(
      (qs) => qs.quizId === quizId || qs.quizId?._id === quizId
    );
    return scoreData?.score;
  };

  const handleStartQuiz = (quizId) => {
    console.log("🎯 ========== CLIC SUR QUIZ ==========");
    console.log("🎯 Quiz ID cliqué:", quizId);
    console.log("🎯 Type de quizId:", typeof quizId);
    console.log("🎯 Longueur de l'ID:", quizId?.length);
    console.log("🎯 isEnrolled:", isEnrolled);
    console.log("🎯 URL à générer:", `/quiz/course/${quizId}`);
    
    if (!isEnrolled) {
      console.warn("⚠️ Utilisateur NON inscrit au cours");
      alert("Vous devez acheter ce cours pour accéder aux quiz");
      return;
    }
    
    console.log("✅ Navigation vers:", `/quiz/course/${quizId}`);
    console.log("======================================");
    navigate(`/quiz/course/${quizId}`);
  };

  if (loading) {
    console.log("⏳ QuizList en chargement...");
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    console.error("❌ QuizList affiche une erreur:", error);
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    console.warn("⚠️ Aucun quiz trouvé pour ce cours");
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <p className="text-gray-600 text-lg">Aucun quiz disponible pour ce cours</p>
      </div>
    );
  }

  console.log("🎨 ========== RENDU DES QUIZ ==========");
  console.log("🎨 Nombre de quiz à afficher:", quizzes.length);
  console.log("======================================");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Quiz du cours ({quizzes.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => {
          const score = getQuizScore(quiz._id);
          const hasCompleted = score !== null && score !== undefined;
          const isPassed = hasCompleted && score >= quiz.points * 0.5;

          return (
            <div
              key={quiz._id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Header avec badge de statut */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">
                  {quiz.title}
                </h3>
                {hasCompleted && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isPassed
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {isPassed ? "Réussi" : "À refaire"}
                  </span>
                )}
                {!isEnrolled && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Verrouillé
                  </span>
                )}
              </div>

              {/* Informations du quiz */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">
                    Durée : <strong>{quiz.duration} minutes</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">
                    Points maximum : <strong>{quiz.points}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <PlayCircle className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">
                    Questions : <strong>{quiz.questions?.length || 0}</strong>
                  </span>
                </div>
              </div>

              {/* Score si complété */}
              {hasCompleted && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    isPassed ? "bg-green-50" : "bg-orange-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        isPassed ? "text-green-600" : "text-orange-600"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isPassed ? "text-green-900" : "text-orange-900"
                      }`}
                    >
                      Votre score
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-bold ${
                        isPassed ? "text-green-700" : "text-orange-700"
                      }`}
                    >
                      {score}
                    </span>
                    <span className="text-gray-600">/ {quiz.points}</span>
                    <span
                      className={`ml-2 text-lg font-semibold ${
                        isPassed ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      ({Math.round((score / quiz.points) * 100)}%)
                    </span>
                  </div>
                </div>
              )}

              {/* Bouton d'action */}
              <button
                onClick={() => handleStartQuiz(quiz._id)}
                disabled={!isEnrolled || !quiz.isActive}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    !isEnrolled || !quiz.isActive
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : hasCompleted
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-105"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                  }
                `}
              >
                {!isEnrolled ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Acheter le cours pour débloquer
                  </>
                ) : !quiz.isActive ? (
                  "Quiz désactivé"
                ) : hasCompleted ? (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Repasser le quiz
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Commencer le quiz
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizList;