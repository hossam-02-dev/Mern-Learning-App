import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Getcourse } from "../../apis/Courses";
import { Preparepayement } from "../../apis/Paiements";
import { TokenContext } from "../../Contexts/AuthContext";
import { CreditCard, Loader, ShieldCheck, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role } = useContext(TokenContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: `/checkout/${id}` } });
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await Getcourse(id);
        if (res.data.success) {
          setCourse(res.data.data);
        } else {
          setError("Cours introuvable");
        }
      } catch (err) {
        console.error("Erreur récupération du cours :", err);
        setError("Impossible de récupérer le cours");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, token, navigate]);

  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      // Récupérer l'userId depuis le token (décodage JWT côté frontend)
      // Pour simplifier, on peut aussi créer un endpoint /api/auth/me
      // Ici on suppose que vous avez l'userId quelque part
      
      // IMPORTANT : Vous devez avoir l'userId de l'utilisateur connecté
      // Option 1 : Décoder le token JWT côté frontend
      // Option 2 : Stocker l'userId dans le Context après login
      // Option 3 : Appeler un endpoint /api/auth/me
      
      // Pour l'instant, je vais supposer que le backend extrait l'userId du token
      const response = await Preparepayement({
        userId: "USER_ID_FROM_TOKEN", // ⚠️ À remplacer par l'userId réel
        courseId: id,
        provider: "stripe",
      });

      if (response.data.success && response.data.data.checkoutUrl) {
        // Redirection vers Stripe Checkout
        window.location.href = response.data.data.checkoutUrl;
      } else {
        setError("Erreur lors de la préparation du paiement");
      }
    } catch (err) {
      console.error("Erreur paiement :", err);
      setError(err?.response?.data?.message || "Erreur lors du paiement");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container mx-auto p-6 text-center min-h-screen flex flex-col justify-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Retour aux cours
        </button>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au cours
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Finaliser votre achat</h1>
            <p className="text-indigo-100">Vous êtes à un clic de commencer votre apprentissage</p>
          </div>

          <div className="p-8">
            {/* Détails du cours */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>

              {course.thumbnail && (
                <img
                  src={`http://localhost:4000${course.thumbnail}`}
                  alt={course.title}
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📹 {course.videos?.length || 0} vidéos</span>
                {course.pdfs?.length > 0 && <span>📄 {course.pdfs.length} documents</span>}
              </div>
            </div>

            {/* Récapitulatif du prix */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg text-gray-600">Prix du cours</span>
                <span className="text-3xl font-bold text-indigo-600">{course.price} DH</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-xl font-semibold">Total à payer</span>
                <span className="text-3xl font-bold text-gray-900">{course.price} DH</span>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Bouton de paiement */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {processing ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  Redirection vers Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  Payer avec Stripe
                </>
              )}
            </button>

            {/* Sécurité */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span>Paiement sécurisé par Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;