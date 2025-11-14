import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const handleRetry = () => {
    // Récupérer l'ID du cours depuis le paiement si nécessaire
    // Pour simplifier, on retourne à la liste des cours
    navigate("/courses");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Paiement annulé</h1>
            <p className="text-lg opacity-90">
              Votre paiement n'a pas été effectué
            </p>
          </div>

          {/* Contenu */}
          <div className="p-8 space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-orange-900 mb-2">
                Que s'est-il passé ?
              </h2>
              <p className="text-orange-800">
                Vous avez annulé le processus de paiement. Aucun montant n'a été débité de votre compte.
              </p>
            </div>

            {paymentId && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Référence :</span>{" "}
                <span className="font-mono">{paymentId}</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <RefreshCcw className="w-6 h-6" />
                Réessayer le paiement
              </button>

              <button
                onClick={() => navigate("/courses")}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour aux cours
              </button>
            </div>

            {/* Aide */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Besoin d'aide ?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Vérifiez que votre carte bancaire est valide</li>
                <li>• Assurez-vous d'avoir des fonds suffisants</li>
                <li>• Contactez votre banque si le problème persiste</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Des questions ?{" "}
          <a 
            href="mailto:support@votreplateforme.com" 
            className="text-indigo-600 hover:underline font-semibold"
          >
            Contactez le support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;