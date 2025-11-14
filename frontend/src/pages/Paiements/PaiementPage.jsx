import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Getpayement } from "../../apis/Paiements";
import axios from "../../apis/axios"; // ✅ AJOUT
import { CheckCircle, Loader, Download, BookOpen } from "lucide-react";

const PaiementPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get("paymentId");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!paymentId) {
      setError("ID de paiement manquant");
      setLoading(false);
      return;
    }

    const fetchAndFinalizePayment = async () => {
      try {
        // ✅ 1. Récupérer les détails du paiement
        console.log("🔍 Récupération du paiement:", paymentId);
        const res = await Getpayement(paymentId);
        
        if (res.data.success) {
          setPayment(res.data.data);
          console.log("✅ Paiement récupéré:", res.data.data);

          // ✅ 2. FINALISER LE PAIEMENT (ajouter l'étudiant au cours)
          console.log("🔄 Finalisation du paiement en cours...");
          try {
            const finalizeRes = await axios.post(`/paiement/finalize/${paymentId}`);
            
            console.log("📦 Réponse finalisation:", finalizeRes.data);
            
            if (finalizeRes.data.success) {
              console.log("✅ Paiement finalisé avec succès !");
              console.log("✅ Vous avez maintenant accès au cours !");
            } else {
              console.warn("⚠️ Finalisation échouée:", finalizeRes.data.message);
            }
          } catch (finalizeErr) {
            console.error("❌ Erreur lors de la finalisation:", finalizeErr);
            console.error("❌ Détails:", finalizeErr.response?.data);
            // On continue même si la finalisation échoue (le paiement est déjà validé)
          }

        } else {
          setError("Paiement introuvable");
        }
      } catch (err) {
        console.error("❌ Erreur récupération du paiement:", err);
        setError("Impossible de récupérer les détails du paiement");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFinalizePayment();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-600 text-xl mb-4">{error || "Erreur inconnue"}</p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  // Animation confetti (optionnel)
  useEffect(() => {
    if (payment?.status === "success" || payment?.status === "succeeded") {
      console.log("🎉 Paiement réussi !");
    }
  }, [payment]);

  const isSuccess = payment.status === "success" || payment.status === "succeeded";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header avec animation */}
          <div className={`p-8 text-white text-center ${
            isSuccess 
              ? "bg-gradient-to-r from-green-500 to-emerald-600" 
              : "bg-gradient-to-r from-yellow-500 to-orange-600"
          }`}>
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <Loader className="w-12 h-12 text-orange-600 animate-spin" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isSuccess ? "🎉 Paiement réussi !" : "⏳ Paiement en cours"}
            </h1>
            <p className="text-lg opacity-90">
              {isSuccess 
                ? "Félicitations ! Vous avez maintenant accès au cours." 
                : "Votre paiement est en cours de traitement."}
            </p>
          </div>

          {/* Détails du paiement */}
          <div className="p-8 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold mb-4">Détails du paiement</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de transaction</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {payment.transactionId || payment._id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant payé</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {payment.montant} {payment.devise || "DH"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode de paiement</span>
                  <span className="font-semibold capitalize">{payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">
                    {payment.paidAt 
                      ? new Date(payment.paidAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : new Date().toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isSuccess 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {payment.status === "succeeded" ? "Validé" : payment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Reçu */}
            {payment.receiptUrl && (
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition"
              >
                <Download className="w-5 h-5" />
                Télécharger le reçu
              </a>
            )}
            
            {/* Actions */}
            {isSuccess && (
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/courses/${payment.courseId}`)}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <BookOpen className="w-6 h-6" />
                  Accéder au cours
                </button>

                <button
                  onClick={() => navigate("/my-courses")}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Voir mes cours
                </button>
              </div>
            )}

            {!isSuccess && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  ℹ️ Votre paiement est en cours de validation. Vous recevrez une confirmation par email sous peu.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message de support */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Besoin d'aide ? Contactez-nous à{" "}
          <a href="mailto:support@votreplateforme.com" className="text-indigo-600 hover:underline">
            support@votreplateforme.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaiementPage;
