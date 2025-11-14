import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Getcourse } from "../../apis/Courses";
import { GetMyProgressInCourse } from "../../apis/Progress";
import { TokenContext } from "../../Contexts/AuthContext";
import { Lock, Play, FileText, CheckCircle } from "lucide-react";
import ProgressBar from "../../components/ProgressBar";
import QuizList from "../Quiz/QuizList"; 

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role } = useContext(TokenContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [myProgress, setMyProgress] = useState(0);
  const [userProgress, setUserProgress] = useState(null); 
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await Getcourse(id, token);
        if (res.data.success) {
          setCourse(res.data.data);
          setIsPurchased(res.data.isPurchased || false);

         
          if (res.data.isPurchased && role === "student") {
            try {
              const progressRes = await GetMyProgressInCourse(id);
              if (progressRes.data.success) {
                setMyProgress(progressRes.data.data.progresspourcent || 0);
                setUserProgress(progressRes.data.data); 
              }
            } catch (err) {
              console.log("Aucune progression pour ce cours");
              setMyProgress(0);
              setUserProgress(null);
            }
          }
        }
      } catch (err) {
        console.error("Erreur récupération du cours :", err);
        setError("Impossible de récupérer le cours");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, token, role]);

  const handlePurchase = () => {
    if (!token) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }
    navigate(`/checkout/${id}`);
  };

  const handleFreeCourse = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/courses/${id}/enroll`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsPurchased(true);
        alert("✅ Inscription réussie !");
       
        window.location.reload();
      } else {
        alert(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur inscription :", err);
      alert("❌ Erreur lors de l'inscription");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 pt-24 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 pt-24 text-center">
        <p className="text-red-500 text-xl">{error}</p>
        <button
          onClick={() => navigate("/courses")}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl"
        >
          Retour aux cours
        </button>
      </div>
    );
  }

  if (!course) return null;

  const isFree = course.price === 0 || course.price === "0";

  return (
    <div className="container mx-auto p-6 pt-24 space-y-8 max-w-6xl">
      {/* En-tête du cours */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-lg opacity-90 mb-6">{course.description}</p>
        
        <div className="flex items-center gap-6">
          <div className="text-3xl font-bold">
            {isFree ? "Gratuit" : `${course.price} DH`}
          </div>
          
          {isPurchased && (
            <div className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Cours acheté</span>
            </div>
          )}
        </div>

        {/* Barre de progression si cours acheté */}
        {isPurchased && role === "student" && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <ProgressBar progress={myProgress} size="lg" />
          </div>
        )}
      </div>

      {/* Thumbnail */}
      {course.thumbnail && (
        <img
          src={`http://localhost:4000${course.thumbnail}`}
          alt={course.title}
          className="w-full h-96 object-cover rounded-2xl shadow-lg"
        />
      )}

      {/* Bouton d'achat/inscription */}
      {role === "student" && !isPurchased && (
        <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-4">
            {isFree ? "Commencer ce cours" : "Acheter ce cours"}
          </h3>
          <button
            onClick={isFree ? handleFreeCourse : handlePurchase}
            className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {isFree ? "S'inscrire gratuitement" : `Acheter pour ${course.price} DH`}
          </button>
        </div>
      )}

      {/* Contenu du cours (Vidéos) */}
      {course.videos?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Play className="w-7 h-7 text-indigo-600" />
            Vidéos du cours
          </h2>

          <div className="space-y-4">
            {course.videos.map((video, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition"
              >
                <p className="font-semibold text-lg mb-3">{video.title || `Vidéo ${idx + 1}`}</p>

                {isPurchased || role === "instructor" || role === "admin" ? (
                  <video
                    src={`http://localhost:4000${video.url}`}
                    controls
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">
                        {isFree ? "Inscrivez-vous" : "Achetez ce cours"} pour accéder aux vidéos
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenu du cours (PDFs) */}
      {course.pdfs?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-600" />
            Documents PDF
          </h2>

          <div className="space-y-4">
            {course.pdfs.map((pdf, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition"
              >
                <p className="font-semibold text-lg mb-3">{pdf.title || `Document ${idx + 1}`}</p>

                {isPurchased || role === "instructor" || role === "admin" ? (
                  <iframe
                    src={`http://localhost:4000${pdf.url}`}
                    className="w-full h-96 rounded-lg border"
                    title={pdf.title}
                  />
                ) : (
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">
                        {isFree ? "Inscrivez-vous" : "Achetez ce cours"} pour accéder aux documents
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ AJOUT : Section Quiz */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <QuizList 
          courseId={course._id} 
          isEnrolled={isPurchased} 
          userProgress={userProgress}
        />
      </div>

      {/* Bouton retour */}
      <button
        onClick={() => navigate("/courses")}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
      >
        ← Retour aux cours
      </button>
    </div>
  );
};

export default CourseDetail;