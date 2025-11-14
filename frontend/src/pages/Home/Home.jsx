import React from 'react';
import { BookOpen, Users, Star, Clock, ChevronRight } from 'lucide-react';
import { useContext } from 'react';
import { TokenContext } from "/src/Contexts/AuthContext.jsx";

import { useNavigate } from 'react-router-dom';


const Home =  () => {
  const {token , role} = useContext(TokenContext);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
     navigate(path);
  };

  const courses = [
    { title: 'Développement Web', level: 'Débutant', students: 2543, rating: 4.8, duration: '12h', image: '🎨' },
    { title: 'Data Science', level: 'Intermédiaire', students: 1832, rating: 4.9, duration: '18h', image: '📊' },
    { title: 'UI/UX Design', level: 'Avancé', students: 1245, rating: 4.7, duration: '10h', image: '✨' },
    { title: 'Marketing Digital', level: 'Débutant', students: 3102, rating: 4.6, duration: '8h', image: '📱' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6">
        <div className="container mx-auto">
          {/* Buttons en haut à droite */}
          <div className="flex justify-end gap-4 mb-16">
            {!token ? (
  <>
            <button 
              onClick={() => handleNavigation('/login')}
              className="px-6 py-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Connexion
            </button>
            <button 
              onClick={() => handleNavigation('/register')}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
            >
              S'inscrire
            </button>
     </>
             ) : (
<button onClick={() => handleNavigation(role === 'student' ? '/my-courses' : '/dashboard')}>
    Mes cours
  </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Apprenez à votre
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> rythme</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Développez vos compétences avec des milliers de cours  créés par des experts. Commencez votre parcours d'apprentissage dès aujourd'hui.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleNavigation('/courses')}
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  Explorer les cours
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl">📚</div>
                    <div>
                      <div className="font-semibold text-gray-900">Cours interactifs</div>
                      <div className="text-sm text-gray-500">Apprentissage pratique</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">🎯</div>
                    <div>
                      <div className="font-semibold text-gray-900">Quiz interactifs</div>
                      <div className="text-sm text-gray-500">Testez vos connaissances</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cours populaires</h2>
            <p className="text-xl text-gray-600">Découvrez nos formations les plus appréciées</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, idx) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-6xl">
                  {course.image}
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full">{course.level}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-bold">Prêt à commencer votre aventure ?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">Rejoignez des milliers d'étudiants qui transforment leur carrière grâce à nos cours</p>
              
{!token && (
  <button 
    onClick={() => handleNavigation('/register')}
    className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg"
  >
    Inscription gratuite
  </button>
)}

         </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ClairSavoir</span>
          </div>
          <p className="text-gray-400">© 2025 ClairSavoir. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
export default Home;