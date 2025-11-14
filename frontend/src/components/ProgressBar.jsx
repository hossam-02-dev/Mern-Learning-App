import React from "react";
import { CheckCircle } from "lucide-react";

const ProgressBar = ({ progress, showLabel = true, size = "md" }) => {
  // Valider le pourcentage (entre 0 et 100)
  const validProgress = Math.min(Math.max(progress || 0, 0), 100);

  // Tailles disponibles
  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  // Couleurs selon le pourcentage
  const getColor = () => {
    if (validProgress === 100) return "bg-green-600";
    if (validProgress >= 75) return "bg-blue-600";
    if (validProgress >= 50) return "bg-yellow-500";
    if (validProgress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full">
      {/* Label avec pourcentage */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progression</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{validProgress}%</span>
            {validProgress === 100 && <CheckCircle className="w-5 h-5 text-green-600" />}
          </div>
        </div>
      )}

      {/* Barre de progression */}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${getColor()} ${sizes[size]} rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1`}
          style={{ width: `${validProgress}%` }}
        >
          {/* Point lumineux à la fin de la barre */}
          {validProgress > 0 && (
            <div className="w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Message selon le niveau */}
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1">
          {validProgress === 100 && "✅ Cours terminé !"}
          {validProgress >= 75 && validProgress < 100 && "🔥 Presque terminé !"}
          {validProgress >= 50 && validProgress < 75 && "💪 Bon progrès !"}
          {validProgress >= 25 && validProgress < 50 && "🚀 Continue comme ça !"}
          {validProgress > 0 && validProgress < 25 && "🌱 Début prometteur !"}
          {validProgress === 0 && "📚 Commencez votre apprentissage"}
        </p>
      )}
    </div>
  );
};

export default ProgressBar;