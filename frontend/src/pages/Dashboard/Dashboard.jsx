import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../Contexts/AuthContext";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Plus,
  BarChart3,
  ClipboardList,
} from "lucide-react";

// Import des APIs
import { GetAllcourses } from "../../apis/Courses";
import { GetMyProgress } from "../../apis/Progress";
import { GetAllpayements } from "../../apis/Paiements";
import { Getallusers } from "../../apis/users";

const Dashboard = () => {
  const { role } = useContext(TokenContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentData, setRecentData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        if (role === "student") {
          await fetchStudentData();
        } else if (role === "prof") {
          await fetchProfData();
        } else if (role === "admin") {
          await fetchAdminData();
        }
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  const fetchStudentData = async () => {
    const coursesRes = await GetAllcourses();
    const myCourses = coursesRes.data.data || [];

    setStats({
      totalCourses: myCourses.length,
      coursesInProgress: myCourses.filter((c) => c.progress < 100).length,
      completedCourses: myCourses.filter((c) => c.progress === 100).length,
      totalHours: myCourses.reduce((acc, c) => acc + (c.duration || 0), 0),
    });

    setRecentData(myCourses.slice(0, 5));
  };

  const fetchProfData = async () => {
    const coursesRes = await GetAllcourses();
    const allCourses = coursesRes.data.data || [];
    const myCourses = allCourses;

    const totalStudents = myCourses.reduce(
      (acc, course) => acc + (course.students?.length || 0),
      0
    );
    
    const totalRevenue = myCourses.reduce(
      (acc, course) => acc + (course.price * (course.students?.length || 0)),
      0
    );

    setStats({
      totalCourses: myCourses.length,
      totalStudents,
      totalRevenue,
      avgRating: 4.7,
    });

    setRecentData(myCourses.slice(0, 5));
  };

  const fetchAdminData = async () => {
    const [coursesRes, usersRes, paymentsRes] = await Promise.all([
      GetAllcourses(),
      Getallusers(),
      GetAllpayements(),
    ]);

    const courses = coursesRes.data.data || [];
    const users = usersRes.data.data || [];
    const payments = paymentsRes.data.data || [];

    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    setStats({
      totalUsers: users.length,
      totalCourses: courses.length,
      totalRevenue,
      recentPayments: payments.length,
    });

    setRecentData({
      recentUsers: users.slice(0, 5),
      recentPayments: payments.slice(0, 5),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {role === "student" && "Mon Tableau de Bord"}
            {role === "prof" && "Tableau de Bord Professeur"}
            {role === "admin" && "Tableau de Bord Administrateur"}
          </h1>
          <p className="text-gray-600">
            {role === "student" && "Suivez votre progression et vos cours"}
            {role === "prof" && "Gérez vos cours et suivez vos étudiants"}
            {role === "admin" && "Vue d'ensemble de la plateforme"}
          </p>
        </div>

        {/* Dashboard STUDENT */}
        {role === "student" && (
          <StudentDashboard stats={stats} recentData={recentData} navigate={navigate} />
        )}

        {/* Dashboard PROF */}
        {role === "prof" && (
          <ProfDashboard stats={stats} recentData={recentData} navigate={navigate} />
        )}

        {/* Dashboard ADMIN */}
        {role === "admin" && (
          <AdminDashboard stats={stats} recentData={recentData} navigate={navigate} />
        )}
      </div>
    </div>
  );
};

// ========== DASHBOARD STUDENT ==========
const StudentDashboard = ({ stats, recentData, navigate }) => (
  <>
    {/* Cartes statistiques */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<BookOpen className="w-8 h-8" />}
        title="Cours suivis"
        value={stats.totalCourses || 0}
        color="bg-blue-500"
      />
      <StatCard
        icon={<Clock className="w-8 h-8" />}
        title="En cours"
        value={stats.coursesInProgress || 0}
        color="bg-yellow-500"
      />
      <StatCard
        icon={<Award className="w-8 h-8" />}
        title="Terminés"
        value={stats.completedCourses || 0}
        color="bg-green-500"
      />
      <StatCard
        icon={<TrendingUp className="w-8 h-8" />}
        title="Heures totales"
        value={`${stats.totalHours || 0}h`}
        color="bg-purple-500"
      />
    </div>

    {/* Mes cours récents */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mes Cours Récents</h2>
        <button
          onClick={() => navigate("/my-courses")}
          className="text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Voir tout →
        </button>
      </div>

      {recentData.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Vous n'avez acheté aucun cours</p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Explorer les cours
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentData.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/courses/${course._id}`)}
              className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition cursor-pointer"
            >
              {course.thumbnail && (
                <img
                  src={`http://localhost:4000${course.thumbnail}`}
                  alt={course.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                
                {/* Barre de progression */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{course.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);

// ========== DASHBOARD PROF ==========
const ProfDashboard = ({ stats, recentData, navigate }) => (
  <>
    {/* Cartes statistiques */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<BookOpen className="w-8 h-8" />}
        title="Cours créés"
        value={stats.totalCourses || 0}
        color="bg-indigo-500"
      />
      <StatCard
        icon={<Users className="w-8 h-8" />}
        title="Total étudiants"
        value={stats.totalStudents || 0}
        color="bg-blue-500"
      />
      <StatCard
        icon={<DollarSign className="w-8 h-8" />}
        title="Revenus générés"
        value={`${stats.totalRevenue || 0} DH`}
        color="bg-green-500"
      />
      <StatCard
        icon={<Award className="w-8 h-8" />}
        title="Note moyenne"
        value={stats.avgRating || "N/A"}
        color="bg-yellow-500"
      />
    </div>

    {/* ✅ BOUTONS D'ACTIONS RAPIDES */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <button
        onClick={() => navigate("/courses/new")}
        className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <Plus className="w-5 h-5" />
        Créer un nouveau cours
      </button>

      <button
        onClick={() => navigate("/quiz/create")}
        className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <ClipboardList className="w-5 h-5" />
        Créer un quiz
      </button>
    </div>

    {/* Mes cours */}
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mes Cours</h2>
        <button
          onClick={() => navigate("/courses")}
          className="text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Gérer tout →
        </button>
      </div>

      {recentData.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de cours</p>
          <button
            onClick={() => navigate("/courses/new")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Créer mon premier cours
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentData.map((course) => (
            <div
              key={course._id}
              className="border-2 border-gray-100 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {course.thumbnail && (
                  <img
                    src={`http://localhost:4000${course.thumbnail}`}
                    alt={course.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {course.students?.length || 0} étudiants
                    </p>
                    <p className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {course.price} DH
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => navigate(`/courses/${course._id}/edit`)}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Modifier
                    </button>
                    {/* ✅ BOUTON CRÉER QUIZ POUR CE COURS */}
                    <button
                      onClick={() => navigate(`/quiz/create?courseId=${course._id}`)}
                      className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                    >
                      + Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);

// ========== DASHBOARD ADMIN ==========
const AdminDashboard = ({ stats, recentData, navigate }) => (
  <>
    {/* Cartes statistiques */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<Users className="w-8 h-8" />}
        title="Total utilisateurs"
        value={stats.totalUsers || 0}
        color="bg-blue-500"
      />
      <StatCard
        icon={<BookOpen className="w-8 h-8" />}
        title="Total cours"
        value={stats.totalCourses || 0}
        color="bg-indigo-500"
      />
      <StatCard
        icon={<DollarSign className="w-8 h-8" />}
        title="Revenus totaux"
        value={`${stats.totalRevenue || 0} DH`}
        color="bg-green-500"
      />
      <StatCard
        icon={<BarChart3 className="w-8 h-8" />}
        title="Paiements récents"
        value={stats.recentPayments || 0}
        color="bg-purple-500"
      />
    </div>

    {/* Actions rapides */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button
        onClick={() => navigate("/users")}
        className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition text-left"
      >
        <Users className="w-8 h-8 text-blue-600 mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">Gérer les utilisateurs</h3>
        <p className="text-sm text-gray-500">Voir et gérer tous les utilisateurs</p>
      </button>

      <button
        onClick={() => navigate("/courses")}
        className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition text-left"
      >
        <BookOpen className="w-8 h-8 text-indigo-600 mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">Gérer les cours</h3>
        <p className="text-sm text-gray-500">Voir et modérer les cours</p>
      </button>

      <button
        onClick={() => navigate("/paiements")}
        className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition text-left"
      >
        <DollarSign className="w-8 h-8 text-green-600 mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">Voir les paiements</h3>
        <p className="text-sm text-gray-500">Historique des transactions</p>
      </button>
    </div>

    {/* Derniers utilisateurs */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Derniers utilisateurs inscrits</h2>
      {recentData.recentUsers?.length > 0 ? (
        <div className="space-y-3">
          {recentData.recentUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">Aucun utilisateur récent</p>
      )}
    </div>

    {/* Derniers paiements */}
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Derniers paiements</h2>
      {recentData.recentPayments?.length > 0 ? (
        <div className="space-y-3">
          {recentData.recentPayments.map((payment) => (
            <div
              key={payment._id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-900">Paiement #{payment._id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="font-bold text-green-600">{payment.amount} DH</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">Aucun paiement récent</p>
      )}
    </div>
  </>
);

// ========== COMPOSANT CARTE STATISTIQUE ==========
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${color} text-white p-4 rounded-xl`}>{icon}</div>
    </div>
  </div>
);

export default Dashboard;