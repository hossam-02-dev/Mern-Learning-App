import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllpayements } from "../../apis/Paiements"
import { TokenContext } from "../../Contexts/AuthContext";
import { Receipt, Loader, Calendar, CreditCard, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

const PaiementHistory = () => {
  const { role } = useContext(TokenContext);
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Note: GetAllpayements récupère tous les paiements (admin uniquement selon vos routes)
        // Pour un étudiant, il faudrait créer une route /api/paiement/my-payments
        const res = await GetAllpayements();
        
        if (res.data.success) {
          // Trier par date (plus récent en premier)
          const sortedPayments = res.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPayments(sortedPayments);
        }
      } catch (err) {
        console.error("Erreur récupération des paiements :", err);
        setError("Impossible de récupérer l'historique des paiements");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
      case "succeeded":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      success: "bg-green-100 text-green-700",
      succeeded: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
    };

    const labels = {
      success: "Réussi",
      succeeded: "Réussi",
      failed: "Échoué",
      pending: "En attente",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center min-h-screen flex flex-col justify-center">
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

  if (payments.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center min-h-screen flex flex-col justify-center">
        <Receipt className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Aucun paiement</h2>
        <p className="text-gray-600 mb-6">Vous n'avez effectué aucun paiement pour le moment.</p>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition mx-auto"
        >
          Explorer les cours
        </button>
      </div>
    );
  }

  const totalSpent = payments
    .filter(p => p.status === "success" || p.status === "succeeded")
    .reduce((sum, p) => sum + p.montant, 0);

  const successfulPayments = payments.filter(p => p.status === "success" || p.status === "succeeded").length;

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Historique des paiements</h1>
          <p className="text-gray-600">Consultez tous vos achats et transactions</p>
        </div>
        <Receipt className="w-12 h-12 text-indigo-600" />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Paiements réussis</p>
          <p className="text-3xl font-bold">{successfulPayments}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Total dépensé</p>
          <p className="text-3xl font-bold">{totalSpent} DH</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">En attente</p>
          <p className="text-3xl font-bold">
            {payments.filter(p => p.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Liste des paiements */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Montant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Méthode</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(payment.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-mono text-sm text-gray-600">
                        {payment.transactionId || payment._id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{payment.provider}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-indigo-600">
                      {payment.montant} {payment.devise || "DH"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm capitalize">{payment.paymentMethod || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/paiements/${payment._id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note pour les étudiants */}
      {role === "student" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Note :</strong> Cette page affiche actuellement tous les paiements. 
            En production, elle devrait afficher uniquement vos propres paiements.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaiementHistory;