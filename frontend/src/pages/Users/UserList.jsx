import React, { useEffect, useState } from "react";
import { Getallusers, Deleteuser } from "../../apis/users";
import { Users, Loader, Trash2, Mail, Award, Calendar, Search } from "lucide-react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const res = await Getallusers();
      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      } else {
        setError("Impossible de récupérer les utilisateurs");
      }
    } catch (err) {
      console.error("Erreur récupération des utilisateurs :", err);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtre par recherche (nom ou email)
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par rôle
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      return;
    }

    try {
      const res = await Deleteuser(userId);
      if (res.data.success) {
        alert("✅ Utilisateur supprimé avec succès");
        fetchUsers();
      } else {
        alert("❌ Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur suppression utilisateur :", err);
      alert("❌ Erreur lors de la suppression de l'utilisateur");
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-red-100 text-red-700",
      prof: "bg-blue-100 text-blue-700",
      student: "bg-green-100 text-green-700",
    };

    const labels = {
      admin: "Admin",
      prof: "Prof",
      student: "Étudiant",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[role] || "bg-gray-100 text-gray-700"}`}>
        {labels[role] || role}
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

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""} trouvé{filteredUsers.length > 1 ? "s" : ""}
          </p>
        </div>
        <Users className="w-12 h-12 text-indigo-600" />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Total</p>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Étudiants</p>
          <p className="text-3xl font-bold">{users.filter((u) => u.role === "student").length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Professeurs</p>
          <p className="text-3xl font-bold">{users.filter((u) => u.role === "prof").length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Admins</p>
          <p className="text-3xl font-bold">{users.filter((u) => u.role === "admin").length}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
            />
          </div>

          {/* Filtre par rôle */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition"
          >
            <option value="all">Tous les rôles</option>
            <option value="student">Étudiants</option>
            <option value="prof">Professeurs</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rôle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cours inscrits</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date d'inscription</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">
                        {user.coursesEnrolled?.length || 0} cours
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        title="Supprimer cet utilisateur"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;