import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Getprofile } from "../../apis/users";
import { TokenContext } from "../../Contexts/AuthContext";
import { User, Mail, Calendar, Award, BookOpen, Loader, Edit } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { role } = useContext(TokenContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await Getprofile();
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setError("Impossible de récupérer le profil");
        }
      } catch (err) {
        console.error("Erreur récupération du profil :", err);
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6 text-center min-h-screen flex flex-col justify-center">
        <p className="text-red-500 text-xl mb-4">{error || "Utilisateur introuvable"}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-red-100 text-red-700",
      prof: "bg-blue-100 text-blue-700",
      student: "bg-green-100 text-green-700",
    };
    
    const labels = {
      admin: "Administrateur",
      prof: "Professeur",
      student: "Étudiant",
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-bold ${styles[role] || "bg-gray-100 text-gray-700"}`}>
        {labels[role] || role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <button
            onClick={() => navigate("/profile/edit")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <Edit className="w-5 h-5" />
            Modifier
          </button>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="p-8 space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Mail className="w-6 h-6 text-indigo-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            {/* Rôle */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Award className="w-6 h-6 text-indigo-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Rôle</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Date de création */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-6 h-6 text-indigo-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Membre depuis</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>

            {/* Cours inscrits (si student) */}
            {user.role === "student" && (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <BookOpen className="w-6 h-6 text-indigo-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Cours suivis</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.coursesEnrolled?.length || 0} cours
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-8 bg-gray-50 border-t space-y-3">
            <button
              onClick={() => navigate("/my-courses")}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
            >
              Voir mes cours
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;