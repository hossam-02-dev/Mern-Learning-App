import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Getprofile } from "../apis/users";
import { logout } from "../apis/Auth";
import { TokenContext } from  "../Contexts/AuthContext";
import { User, BookOpen, CreditCard, LogOut, ChevronDown, TrendingUp } from "lucide-react";

const UserMenu = () => {
  const { setToken, setRole } = useContext(TokenContext);
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  // Récupérer le nom de l'utilisateur
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await Getprofile();
        if (res.data.success) {
          setUserName(res.data.data.name);
        }
      } catch (err) {
        console.error("Erreur récupération profil :", err);
        setUserName("Utilisateur");
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setToken(null);
      setRole(null);
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton principal */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-gray-700 hidden sm:block">{userName}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
          {/* Header du menu */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <p className="text-sm opacity-80">Connecté en tant que</p>
            <p className="font-bold truncate">{userName}</p>
          </div>

          {/* Liste des liens */}
          <div className="py-2">
            {/* Mon Profil */}
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Mon Profil</span>
            </Link>

            {/* Mes Cours */}
            <Link
              to="/my-courses"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Mes Cours</span>
            </Link>

            {/* ✅ Ma Progression */}
            <Link
              to="/my-progress"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Ma Progression</span>
            </Link>

            {/* Mes Paiements */}
            <Link
              to="/paiements"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Mes Paiements</span>
            </Link>

            {/* Séparateur */}
            <div className="my-2 border-t border-gray-200"></div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserMenu;