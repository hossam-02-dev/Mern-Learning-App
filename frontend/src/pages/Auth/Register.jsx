// ⚡ Version corrigée sans JWT decode
import React, { useState, useContext } from 'react';
import { register } from '../../apis/Auth';
import { TokenContext } from '../../Contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, User, UserCircle } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [userrole, setUserRole] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const { setToken, setRole } = useContext(TokenContext);
  const navigate = useNavigate();

  const handleregister = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setErreur("Les mots de passe ne correspondent pas !");
      return;
    }

    const data = { name, email, password, role: userrole };

    try {
      setLoading(true);
      const res = await register(data);

      if (res.data.success) {
        const token = res.data.data;

        // Stockage du token et du rôle choisi par l'utilisateur
        localStorage.setItem("token", token);
        localStorage.setItem("role", userrole);
        setToken(token);
        setRole(userrole);

        setErreur('');

        // Redirection
        if (userrole === "admin" || userrole === "prof") {
          navigate("/dashboard");
        } else {
          navigate("/my-courses");
        }
      } else {
        setErreur(res.data.message || "Erreur d'inscription");
      }
    } catch (error) {
      console.error("Échec d'inscription ❌", error);
      setErreur("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* Logo et titre */}
        <div className="text-center mb-10 pt-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-9 h-9 text-white" />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ClairSavoir
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Créer un compte</h1>
          <p className="text-xl text-gray-600">Rejoignez notre communauté d'apprentissage</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <form onSubmit={handleregister} className="space-y-8">
            {/* Nom */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Nom</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder='Veuillez entrer votre nom'
                  autoComplete='off'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-16 pr-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors duration-300 text-gray-900"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="email"
                  placeholder='Veuillez entrer votre email'
                  autoComplete='off'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-16 pr-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors duration-300 text-gray-900"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="password"
                  placeholder='Veuillez entrer votre mot de passe'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-16 pr-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors duration-300 text-gray-900"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type='password'
                  placeholder='Veuillez confirmer votre mot de passe'
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  className="w-full pl-16 pr-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors duration-300 text-gray-900"
                />
              </div>
            </div>

            {/* Role Select */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Rôle</label>
              <div className="relative">
                <UserCircle className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <select
                  required
                  value={userrole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full pl-16 pr-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors duration-300 text-gray-900 appearance-none bg-white"
                >
                  <option value="">Veuillez sélectionner un rôle</option>
                  <option value="admin">admin</option>
                  <option value="prof">prof</option>
                  <option value="student">student</option>
                </select>
              </div>
            </div>

            {/* Message d'erreur */}
            {erreur && (
              <p className="text-red-600 font-medium text-center">{erreur}</p>
            )}

            {/* Bouton d'inscription */}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-xl transition-all duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:scale-105'
              }`}
            >
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </button>
          </form>

          {/* Lien connexion */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
