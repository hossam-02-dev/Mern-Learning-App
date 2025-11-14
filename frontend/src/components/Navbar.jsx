import { Link, useNavigate } from "react-router-dom";
import { HomeIcon, Book, BookOpen, LogOut, Plus, LayoutDashboard } from "lucide-react";
import { useContext } from "react";
import { TokenContext } from "../Contexts/AuthContext";
import UserMenu from "./UserMenu"; // ✅ AJOUT : Import du UserMenu

const Navbar = () => {
  const { token, setToken, role, setRole } = useContext(TokenContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    navigate("/");
  };

  return (
    <div className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ClairSavoir
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* Accueil */}
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300 relative group px-3 py-2"
          >
            <HomeIcon className="w-5 h-5" />
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Cours (tous les utilisateurs connectés) */}
          {token && (
            <>
              <Link
                to="/courses"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300 relative group px-3 py-2"
              >
                <Book className="w-5 h-5" />
                Cours
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300 relative group px-3 py-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Créer un cours (Prof & Admin uniquement) */}
              {(role === "prof" || role === "admin") && (
                <Link
                  to="/courses/new"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Créer un cours
                </Link>
              )}

              {/* ✅ REMPLACEMENT : UserMenu au lieu du bouton Déconnexion */}
              <UserMenu />
            </>
          )}

          {/* Connexion / Inscription (si pas connecté) */}
          {!token && (
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-300"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;