import React, { useContext, useState } from 'react';
import { login } from "../../apis/Auth";
import { TokenContext } from '../../Contexts/AuthContext';
import { BookOpen, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMssg, setErrMssg] = useState("");
  const [successMssg, setSuccessMssg] = useState("");
  const { setToken, setRole } = useContext(TokenContext);
  const navigate = useNavigate();

  // ✅ Fonction pour décoder un JWT sans librairie
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Erreur de décodage du token :", e);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password });

      if (res.data.success) {
        const token = res.data.data; // le token JWT
        const decoded = parseJwt(token);
        const role = decoded?.role || "user"; // rôle par défaut si non trouvé

        // Stocker dans le localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Mettre à jour le contexte
        setToken(token);
        setRole(role);

        setSuccessMssg("Connexion réussie !");
        setErrMssg("");

        // ✅ Redirection selon le rôle
        if (role === "admin" || role === "prof") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/my-courses", { replace: true });
        }
      } else {
        setErrMssg(res.data.message || "Erreur de connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      setErrMssg("Email ou mot de passe incorrect");
      setSuccessMssg("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl">
        {/* Logo et titre */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-9 h-9 text-white" />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ClairSavoir
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Bon retour !</h1>
          <p className="text-xl text-gray-600">Connectez-vous pour continuer votre apprentissage</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="email"
                  placeholder="Veuillez entrer votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-16 pr-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors duration-300 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="password"
                  placeholder="Veuillez entrer votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-16 pr-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors duration-300 text-gray-900"
                />
              </div>
            </div>

            {errMssg && (
              <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-xl text-red-600">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="text-base font-medium">{errMssg}</p>
              </div>
            )}

            {successMssg && (
              <div className="flex items-center gap-3 p-5 bg-green-50 border border-green-200 rounded-xl text-green-600">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <p className="text-base font-medium">{successMssg}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-xl"
            >
              Connexion
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">
              Pas encore de compte ?{' '}
              <a href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                S'inscrire
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
